'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import CollectionTabView from '../components/cards/CollectionTab'
import CardImage from '../components/cards/CardImage'
import {
  cardName,
  cardEra,
  cardCategory,
  cardFlavor,
  lessonQuestion,
  lessonChoice,
  lessonExplanation,
  nodeLabel,
  nodeCategory,
  nodeGroup,
  getLockedLabel,
  getRarityStyle
} from '../lib/cardUtils'
import {
  getPackConfig,
  getDifficultyLabel,
  drawRarity,
  upgradeRarityForGuarantee,
  pickRandomCard
} from '../lib/packUtils'
import {
  WORLD_MAP_IMAGE_URL,
  WORLD_DATA,
  MAP_REGIONS,
  getSubject,
  getEra,
  getDisplayName,
  getCurrentContentKey
} from '../lib/worldData'

const UI = {
  ko: {
    appTitle: 'Hi-Story',
    subtitle: '역사로 언어를 배우는 카드 수집 RPG',
    start: 'Google로 시작하기',
    progress: '현재 콘텐츠 진행도',
    completed: '획득',
    remaining: '미획득',
    total: '전체',
    tabs: {
      map: '지도',
      quiz: '퀘스트',
      roadmap: '로드맵',
      collection: '도감',
      profile: '내정보'
    },
    quiz: {
      eyebrow: '오늘의 역사 영어',
      title: '언어 퀘스트',
      hint: '정답 5개를 모으면 선택한 시대의 카드팩을 개봉합니다.',
      question: '역사 퀴즈',
      correct: '정답입니다!',
      wrong: '오답입니다',
      tryAgain: '다시 골라보세요.',
      next: '다음 퀘스트',
      noQuiz: '선택한 시대에 등록된 퀴즈가 없습니다.'
    },
    roadmap: {
      eyebrow: '학습 여정',
      title: '로드맵',
      desc: '선택한 시대의 역사 노드를 따라 학습합니다.',
      tap: '노드를 눌러보세요',
      unlocked: '해금 완료',
      locked: '미해금',
      lockedQuest: '아직 해금되지 않은 퀘스트'
    },
    collection: {
      eyebrow: '카드 도감',
      title: '내 도감',
      owned: '획득한 카드',
      locked: '미획득 카드',
      empty: '아직 획득한 카드가 없습니다.',
      complete: '선택한 시대의 카드를 모두 모았습니다!',
      undiscovered: '미발견 카드',
      unlockHint: '카드팩을 열어 해금'
    },
    profile: {
      explorer: 'Hi-Story 탐험가',
      level: '레벨',
      exp: '경험치',
      quest: '카드',
      completion: '완성도',
      appLanguage: '앱 언어',
      studyLanguage: '학습 언어',
      logout: '로그아웃'
    },
    status: {
      loading: '불러오는 중...',
      userError: '사용자 정보를 불러오지 못했습니다.',
      cardsError: '카드 정보를 불러오지 못했습니다.',
      lessonsError: '퀴즈 정보를 불러오지 못했습니다.',
      ownedError: '보유 카드 정보를 불러오지 못했습니다.'
    }
  },
  en: {
    appTitle: 'Hi-Story',
    subtitle: 'Learn languages through history cards',
    start: 'Continue with Google',
    progress: 'Current Content Progress',
    completed: 'Owned',
    remaining: 'Locked',
    total: 'Total',
    tabs: {
      map: 'Map',
      quiz: 'Quest',
      roadmap: 'Roadmap',
      collection: 'Cards',
      profile: 'Profile'
    },
    quiz: {
      eyebrow: "Today's History English",
      title: 'Language Quest',
      hint: 'Answer 5 questions correctly to open a card pack for the selected era.',
      question: 'History Quiz',
      correct: 'Correct!',
      wrong: 'Not quite',
      tryAgain: 'Try again.',
      next: 'Next Quest',
      noQuiz: 'No quiz has been added for this era yet.'
    },
    roadmap: {
      eyebrow: 'Learning Journey',
      title: 'Roadmap',
      desc: 'Follow historical nodes for the selected era.',
      tap: 'Tap a node',
      unlocked: 'Unlocked',
      locked: 'Locked',
      lockedQuest: 'Locked Quest'
    },
    collection: {
      eyebrow: 'Card Collection',
      title: 'My Cards',
      owned: 'Unlocked Cards',
      locked: 'Locked Cards',
      empty: 'You have not unlocked any cards yet.',
      complete: 'You completed the selected era collection!',
      undiscovered: 'Undiscovered Card',
      unlockHint: 'Unlock through card packs'
    },
    profile: {
      explorer: 'Hi-Story Explorer',
      level: 'Level',
      exp: 'EXP',
      quest: 'Cards',
      completion: 'Completion',
      appLanguage: 'App Language',
      studyLanguage: 'Study Language',
      logout: 'Log out'
    },
    status: {
      loading: 'Loading...',
      userError: 'Could not load user information.',
      cardsError: 'Could not load card data.',
      lessonsError: 'Could not load quiz data.',
      ownedError: 'Could not load your cards.'
    }
  }
}

function isSameContent(record, currentContentKey, visibleCardIds) {
  if (!record || !currentContentKey) return false

  if (record.route_id === currentContentKey) return true
  if (record.era_id === currentContentKey) return true
  if (record.pack_group === currentContentKey) return true

  if (currentContentKey === 'goguryeo') {
    if (record.era === '고구려' || record.era_en === 'Goguryeo') return true
    if (record.roadmap_group === '고구려' || record.roadmap_group_en === 'Goguryeo') return true
  }

  if (record.reward_card_id && visibleCardIds?.has(record.reward_card_id)) return true
  if (record.card_id && visibleCardIds?.has(record.card_id)) return true
  if (record.id && visibleCardIds?.has(record.id)) return true

  return false
}

export default function Home() {
  const [appLanguage, setAppLanguage] = useState('ko')
  const t = UI[appLanguage] || UI.ko

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [lessons, setLessons] = useState([])
  const [allCards, setAllCards] = useState([])
  const [roadmapNodes, setRoadmapNodes] = useState([])
  const [ownedCards, setOwnedCards] = useState([])

  const [currentScreen, setCurrentScreen] = useState('world')
  const [activeTab, setActiveTab] = useState('quiz')
  const [selectedDifficulty, setSelectedDifficulty] = useState(1)
  const [selectedSubject, setSelectedSubject] = useState('korea')
  const [selectedEra, setSelectedEra] = useState('three_kingdoms')
  const [selectedRoute, setSelectedRoute] = useState('goguryeo')

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [resultMessage, setResultMessage] = useState('')
  const [rewardMessage, setRewardMessage] = useState('')
  const [packResult, setPackResult] = useState(null)
  const [quizCorrectCount, setQuizCorrectCount] = useState(0)
  const [selectedNode, setSelectedNode] = useState(null)

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const currentContentKey = getCurrentContentKey(selectedEra, selectedRoute)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('hiStoryAppLanguage')

    if (savedLanguage === 'ko' || savedLanguage === 'en') {
      setAppLanguage(savedLanguage)
    }

    loadData()
  }, [])

  const changeAppLanguage = () => {
    const next = appLanguage === 'ko' ? 'en' : 'ko'
    setAppLanguage(next)
    localStorage.setItem('hiStoryAppLanguage', next)
  }

  const loadData = async () => {
    setLoading(true)
    setErrorMessage('')

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error(userError)
      setErrorMessage(t.status.userError)
      setLoading(false)
      return
    }

    const currentUser = userData.user
    setUser(currentUser)

    if (!currentUser) {
      setLoading(false)
      return
    }

    const nickname =
      currentUser.user_metadata?.name ||
      currentUser.user_metadata?.full_name ||
      currentUser.email

    const { data: savedProfile } = await supabase
      .from('profiles')
      .upsert({
        id: currentUser.id,
        nickname,
        level: 1,
        exp: 0
      })
      .select()
      .single()

    if (savedProfile) setProfile(savedProfile)

    await loadAllCards()
    await loadLessons()
    await loadRoadmapNodes()
    await loadOwnedCards(currentUser.id)

    setLoading(false)
  }

  const loadAllCards = async () => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('year_start', { ascending: true })

    if (error) {
      console.error(error)
      setErrorMessage(t.status.cardsError)
      return
    }

    setAllCards(data || [])
  }

  const loadLessons = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('lesson_code', { ascending: true })

    if (error) {
      console.error(error)
      setErrorMessage(t.status.lessonsError)
      return
    }

    setLessons(data || [])
  }

  const loadRoadmapNodes = async () => {
    const { data, error } = await supabase
      .from('roadmap_nodes')
      .select('*')
      .order('y_order', { ascending: true })

    if (error) {
      console.error(error)
      setRoadmapNodes([])
      return
    }

    setRoadmapNodes(data || [])
  }

  const loadOwnedCards = async (userId) => {
    const { data: userCardsData, error: userCardsError } = await supabase
      .from('user_cards')
      .select('*')
      .eq('user_id', userId)
      .order('obtained_at', { ascending: false })

    if (userCardsError) {
      console.error(userCardsError)
      setErrorMessage(t.status.ownedError)
      return
    }

    if (!userCardsData || userCardsData.length === 0) {
      setOwnedCards([])
      return
    }

    const cardIds = userCardsData.map((item) => item.card_id)

    const { data: cardsData, error: cardsError } = await supabase
      .from('cards')
      .select('*')
      .in('id', cardIds)

    if (cardsError) {
      console.error(cardsError)
      setErrorMessage(t.status.ownedError)
      return
    }

    const mergedCards = userCardsData.map((userCard) => ({
      ...userCard,
      card: cardsData.find((card) => card.id === userCard.card_id)
    }))

    setOwnedCards(mergedCards)
  }

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  const visibleCards = useMemo(() => {
    const filtered = allCards.filter((card) => isSameContent(card, currentContentKey))
    return filtered.length > 0 ? filtered : allCards
  }, [allCards, currentContentKey])

  const visibleCardIds = useMemo(() => {
    return new Set(visibleCards.map((card) => card.id))
  }, [visibleCards])

  const activeLessons = useMemo(() => {
    const contentLessons = lessons.filter((lesson) => isSameContent(lesson, currentContentKey, visibleCardIds))
    const difficultyLessons = contentLessons.filter((lesson) => Number(lesson.difficulty || 1) === Number(selectedDifficulty || 1))

    if (difficultyLessons.length > 0) return difficultyLessons
    if (contentLessons.length > 0) return contentLessons

    const fallbackByDifficulty = lessons.filter((lesson) => Number(lesson.difficulty || 1) === Number(selectedDifficulty || 1))
    return fallbackByDifficulty.length > 0 ? fallbackByDifficulty : lessons
  }, [lessons, currentContentKey, visibleCardIds, selectedDifficulty])

  const visibleRoadmapNodes = useMemo(() => {
    const filtered = roadmapNodes.filter((node) => isSameContent(node, currentContentKey, visibleCardIds))
    return filtered.length > 0 ? filtered : roadmapNodes
  }, [roadmapNodes, currentContentKey, visibleCardIds])

  const visibleOwnedCards = useMemo(() => {
    return ownedCards.filter((item) => item.card && visibleCardIds.has(item.card_id))
  }, [ownedCards, visibleCardIds])

  const visibleOwnedCardIds = visibleOwnedCards.map((item) => item.card_id)
  const visibleLockedCards = visibleCards.filter((card) => !visibleOwnedCardIds.includes(card.id))
  const visibleOwnedCount = visibleOwnedCards.length
  const visibleTotalCount = visibleCards.length
  const visibleCollectionRate =
    visibleTotalCount > 0 ? Math.round((visibleOwnedCount / visibleTotalCount) * 100) : 0

  const currentLesson = activeLessons[currentLessonIndex]

  const addCardToUser = async (card) => {
    if (!user || !card) return

    const { data: existingCard, error: existingError } = await supabase
      .from('user_cards')
      .select('*')
      .eq('user_id', user.id)
      .eq('card_id', card.id)
      .maybeSingle()

    if (existingError) {
      console.error(existingError)
      return
    }

    if (existingCard) {
      await supabase
        .from('user_cards')
        .update({ count: (existingCard.count || 1) + 1 })
        .eq('id', existingCard.id)
    } else {
      await supabase
        .from('user_cards')
        .insert({
          id: crypto.randomUUID(),
          user_id: user.id,
          card_id: card.id,
          count: 1
        })
    }
  }

  const openCardPack = async () => {
    const packConfig = getPackConfig(selectedDifficulty)
    const pulledCards = []

    for (let index = 0; index < packConfig.count; index += 1) {
      let rarity = drawRarity(packConfig.rates)

      if (index === 0 && packConfig.guaranteedMinimumRarity) {
        rarity = upgradeRarityForGuarantee(rarity, packConfig.guaranteedMinimumRarity)
      }

      const card = pickRandomCard(visibleCards, rarity)

      if (card) {
        await addCardToUser(card)
        pulledCards.push(card)
      }
    }

    setPackResult({
      name: appLanguage === 'en' ? packConfig.name : packConfig.nameKo,
      cards: pulledCards,
      difficulty: selectedDifficulty,
      contentKey: currentContentKey
    })

    if (user) await loadOwnedCards(user.id)
    await loadAllCards()
  }

  const handleAnswer = async (choiceNumber) => {
    if (!user || !currentLesson) return

    setSelectedChoice(choiceNumber)
    setResultMessage('')
    setRewardMessage('')
    setPackResult(null)

    const isCorrect = Number(choiceNumber) === Number(currentLesson.answer)

    if (!isCorrect) {
      setResultMessage(t.quiz.wrong)
      setRewardMessage(t.quiz.tryAgain)
      return
    }

    const nextCorrectCount = quizCorrectCount + 1
    setResultMessage(t.quiz.correct)

    if (nextCorrectCount >= 5) {
      setQuizCorrectCount(0)
      setRewardMessage(appLanguage === 'en' ? 'Card pack acquired! Pack opened.' : '카드팩 획득! 팩을 개봉했습니다.')
      await openCardPack()
      return
    }

    setQuizCorrectCount(nextCorrectCount)
    setRewardMessage(appLanguage === 'en' ? `Pack progress ${nextCorrectCount}/5` : `카드팩까지 ${nextCorrectCount}/5 정답`)
  }

  const goNextQuiz = () => {
    setSelectedChoice(null)
    setResultMessage('')
    setRewardMessage('')
    setPackResult(null)

    if (currentLessonIndex < activeLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    } else {
      setCurrentLessonIndex(0)
    }
  }

  const enterContent = ({ eraId, routeId }) => {
    setSelectedEra(eraId)
    setSelectedRoute(routeId)
    setSelectedDifficulty(1)
    setCurrentLessonIndex(0)
    setQuizCorrectCount(0)
    setSelectedChoice(null)
    setResultMessage('')
    setRewardMessage('')
    setPackResult(null)
    setCurrentScreen('difficulty')
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>
          <h1>{t.appTitle}</h1>
          <p>{t.status.loading}</p>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <Hero
          t={t}
          user={user}
          profile={profile}
          appLanguage={appLanguage}
          changeAppLanguage={changeAppLanguage}
          login={login}
          collectionRate={visibleCollectionRate}
          ownedCount={visibleOwnedCount}
          lockedCount={visibleLockedCards.length}
          totalCount={visibleTotalCount}
          currentContentKey={currentContentKey}
        />

        {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

        {user && currentScreen === 'world' && (
          <WorldMapScreen
            appLanguage={appLanguage}
            ownedCount={visibleOwnedCount}
            totalCount={visibleTotalCount}
            setSelectedSubject={setSelectedSubject}
            setSelectedEra={setSelectedEra}
            setSelectedRoute={setSelectedRoute}
            setCurrentScreen={setCurrentScreen}
          />
        )}

        {user && currentScreen === 'timeline' && (
          <TimelineScreen
            appLanguage={appLanguage}
            selectedSubject={selectedSubject}
            setSelectedEra={setSelectedEra}
            setSelectedRoute={setSelectedRoute}
            setCurrentScreen={setCurrentScreen}
            enterContent={enterContent}
          />
        )}

        {user && currentScreen === 'civilization' && (
          <CivilizationScreen
            appLanguage={appLanguage}
            selectedSubject={selectedSubject}
            selectedEra={selectedEra}
            setSelectedRoute={setSelectedRoute}
            setCurrentScreen={setCurrentScreen}
            enterContent={enterContent}
          />
        )}

        {user && currentScreen === 'difficulty' && (
          <DifficultyScreen
            appLanguage={appLanguage}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            setActiveTab={setActiveTab}
            setCurrentScreen={setCurrentScreen}
            setCurrentLessonIndex={setCurrentLessonIndex}
            currentContentKey={currentContentKey}
          />
        )}

        {user && currentScreen === 'content' && (
          <button onClick={() => setCurrentScreen('world')} style={backButtonStyle}>← {appLanguage === 'en' ? 'World Map' : '월드맵으로'}</button>
        )}

        {user && currentScreen === 'content' && activeTab === 'quiz' && (
          <QuizTab
            t={t}
            appLanguage={appLanguage}
            currentLesson={currentLesson}
            currentLessonIndex={currentLessonIndex}
            lessons={activeLessons}
            selectedChoice={selectedChoice}
            resultMessage={resultMessage}
            rewardMessage={rewardMessage}
            packResult={packResult}
            setPackResult={setPackResult}
            handleAnswer={handleAnswer}
            goNextQuiz={goNextQuiz}
            quizCorrectCount={quizCorrectCount}
          />
        )}

        {user && currentScreen === 'content' && activeTab === 'roadmap' && (
          <RoadmapTab
            t={t}
            appLanguage={appLanguage}
            roadmapNodes={visibleRoadmapNodes}
            allCards={visibleCards}
            ownedCardIds={visibleOwnedCardIds}
            ownedCount={visibleOwnedCount}
            totalCount={visibleTotalCount}
            collectionRate={visibleCollectionRate}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />
        )}

        {user && currentScreen === 'content' && activeTab === 'collection' && (
          <CollectionTabView
            t={t}
            appLanguage={appLanguage}
            ownedCards={visibleOwnedCards}
            lockedCards={visibleLockedCards}
            ownedCount={visibleOwnedCount}
            totalCount={visibleTotalCount}
            collectionRate={visibleCollectionRate}
          />
        )}

        {user && currentScreen === 'content' && activeTab === 'profile' && (
          <ProfileTab
            t={t}
            appLanguage={appLanguage}
            changeAppLanguage={changeAppLanguage}
            user={user}
            profile={profile}
            ownedCount={visibleOwnedCount}
            totalCount={visibleTotalCount}
            collectionRate={visibleCollectionRate}
            logout={logout}
          />
        )}

        {user && (
          <nav style={styles.bottomNav}>
            <button onClick={() => setCurrentScreen('world')} style={tabStyle(currentScreen !== 'content')}>
              <span>🌍</span>
              <small>{t.tabs.map}</small>
            </button>
            <button onClick={() => { setActiveTab('roadmap'); setCurrentScreen('content') }} style={tabStyle(currentScreen === 'content' && activeTab === 'roadmap')}>
              <span>🗺️</span>
              <small>{t.tabs.roadmap}</small>
            </button>
            <button onClick={() => { setActiveTab('collection'); setCurrentScreen('content') }} style={tabStyle(currentScreen === 'content' && activeTab === 'collection')}>
              <span>📚</span>
              <small>{t.tabs.collection}</small>
            </button>
            <button onClick={() => { setActiveTab('profile'); setCurrentScreen('content') }} style={tabStyle(currentScreen === 'content' && activeTab === 'profile')}>
              <span>👤</span>
              <small>{t.tabs.profile}</small>
            </button>
          </nav>
        )}
      </div>
    </main>
  )
}

function Hero({ t, user, profile, appLanguage, changeAppLanguage, login, collectionRate, ownedCount, lockedCount, totalCount, currentContentKey }) {
  return (
    <section style={styles.hero}>
      <div style={styles.heroTop}>
        <div>
          <p style={styles.heroEyebrow}>LANGUAGE THROUGH HISTORY · {currentContentKey}</p>
          <h1 style={styles.title}>{t.appTitle}</h1>
        </div>
        <div style={styles.heroButtons}>
          <button onClick={changeAppLanguage} style={styles.langButton}>🌐 {appLanguage.toUpperCase()}</button>
          {user && <div style={styles.levelBadge}>Lv. {profile?.level ?? 1}</div>}
        </div>
      </div>
      <p style={styles.heroText}>{t.subtitle}</p>
      {!user ? (
        <button onClick={login} style={styles.goldButton}>{t.start}</button>
      ) : (
        <>
          <div style={styles.progressHeader}><span>{t.progress}</span><strong>{collectionRate}%</strong></div>
          <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${collectionRate}%` }} /></div>
          <div style={styles.statRow}>
            <div style={styles.statBox}><strong>{ownedCount}</strong><span>{t.completed}</span></div>
            <div style={styles.statBox}><strong>{lockedCount}</strong><span>{t.remaining}</span></div>
            <div style={styles.statBox}><strong>{totalCount}</strong><span>{t.total}</span></div>
          </div>
        </>
      )}
    </section>
  )
}

function WorldMapScreen({ appLanguage, ownedCount, totalCount, setSelectedSubject, setSelectedEra, setSelectedRoute, setCurrentScreen }) {
  const isEnglish = appLanguage === 'en'
  const koreaProgress = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0
  const [mapZoom, setMapZoom] = useState(1.2)
  const [mapPosition, setMapPosition] = useState({ x: -190, y: -32 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredRegion, setHoveredRegion] = useState(null)

  const startDrag = (clientX, clientY) => {
    setIsDragging(true)
    setDragStart({ x: clientX - mapPosition.x, y: clientY - mapPosition.y })
  }
  const moveDrag = (clientX, clientY) => {
    if (!isDragging) return
    setMapPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y })
  }
  const stopDrag = () => setIsDragging(false)

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.goldEyebrow}>{isEnglish ? 'World Map' : '세계 지도'}</p>
          <h2 style={styles.sectionTitle}>{isEnglish ? 'Choose a Region' : '지도에서 지역을 선택하세요'}</h2>
        </div>
      </div>
      <div style={mapPanelStyle}>
        <div style={mapToolbarStyle}>
          <span>{isEnglish ? 'Drag map · Zoom controls' : '지도를 드래그하고 확대/축소하세요'}</span>
          <div style={mapToolButtonsStyle}>
            <button onClick={() => setMapZoom((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))))} style={mapToolButtonStyle}>−</button>
            <button onClick={() => setMapZoom((z) => Math.min(2.1, Number((z + 0.15).toFixed(2))))} style={mapToolButtonStyle}>＋</button>
            <button onClick={() => { setMapZoom(1.2); setMapPosition({ x: -190, y: -32 }) }} style={mapToolButtonStyle}>Reset</button>
          </div>
        </div>
        <div
          style={mapViewportStyle}
          onMouseDown={(event) => startDrag(event.clientX, event.clientY)}
          onMouseMove={(event) => moveDrag(event.clientX, event.clientY)}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={(event) => { const touch = event.touches[0]; startDrag(touch.clientX, touch.clientY) }}
          onTouchMove={(event) => { const touch = event.touches[0]; moveDrag(touch.clientX, touch.clientY) }}
          onTouchEnd={stopDrag}
        >
          <div style={{ ...mapLayerStyle, transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapZoom})`, cursor: isDragging ? 'grabbing' : 'grab' }}>
            {React.createElement('img', { src: WORLD_MAP_IMAGE_URL, alt: 'Hi-Story world map', style: mapImageStyle, draggable: false })}
            {MAP_REGIONS.map((region) => {
              const active = hoveredRegion === region.id
              const label = isEnglish ? region.labelEn : region.labelKo
              return (
                <button
                  key={region.id}
                  disabled={!region.enabled}
                  onClick={(event) => {
                    event.stopPropagation()
                    if (!region.enabled) return
                    setSelectedSubject(region.id)
                    setSelectedEra(null)
                    setSelectedRoute(null)
                    setCurrentScreen('timeline')
                  }}
                  onMouseDown={(event) => event.stopPropagation()}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onFocus={() => setHoveredRegion(region.id)}
                  onBlur={() => setHoveredRegion(null)}
                  style={{
                    ...mapRegionButtonStyle,
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    opacity: region.enabled ? 1 : 0.55,
                    transform: `translate(-50%, -50%) scale(${active ? 1.12 : 1})`,
                    borderColor: active ? '#facc15' : region.enabled ? 'rgba(214,179,90,0.55)' : 'rgba(148,163,184,0.28)',
                    boxShadow: active ? '0 0 0 4px rgba(250,204,21,0.18), 0 16px 30px rgba(0,0,0,0.48)' : '0 8px 20px rgba(0,0,0,0.28)',
                    cursor: region.enabled ? 'pointer' : 'not-allowed'
                  }}
                >
                  <span style={flagBubbleStyle}>{region.flag}</span>
                  <strong>{label}</strong>
                  <small>{region.enabled ? (isEnglish ? 'Open' : '입장') : (isEnglish ? 'Soon' : '준비중')}</small>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div style={worldIntroStyle}>
        <strong>{isEnglish ? 'A map-first history language platform.' : '지도에서 시작하는 역사 언어학습 플랫폼입니다.'}</strong>
        <p>{isEnglish ? 'Choose Korea to explore eras such as Gojoseon, Goguryeo, Goryeo, Joseon, and Modern Korea.' : '한국사를 선택하면 고조선, 고구려, 고려, 조선, 근현대 콘텐츠로 이어집니다.'}</p>
        <div style={miniProgressTrackStyle}><div style={{ ...miniProgressFillStyle, width: `${koreaProgress}%` }} /></div>
      </div>
    </section>
  )
}

function TimelineScreen({ appLanguage, selectedSubject, setSelectedEra, setSelectedRoute, setCurrentScreen, enterContent }) {
  const subject = getSubject(selectedSubject)
  const eras = subject.eras || []
  const isEnglish = appLanguage === 'en'

  return (
    <section style={styles.section}>
      <button onClick={() => setCurrentScreen('world')} style={backButtonStyle}>← {isEnglish ? 'World Map' : '세계 지도로'}</button>
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.goldEyebrow}>{getDisplayName(subject, appLanguage)}</p>
          <h2 style={styles.sectionTitle}>{isEnglish ? 'Timeline' : '타임라인 선택'}</h2>
        </div>
      </div>
      <div style={timelineWrapStyle}>
        {eras.map((era, index) => (
          <button
            key={era.id}
            disabled={!era.enabled}
            onClick={() => {
              if (!era.enabled) return
              setSelectedEra(era.id)
              if (era.routes && era.routes.length > 0) {
                setSelectedRoute(null)
                setCurrentScreen('civilization')
              } else {
                enterContent({ eraId: era.id, routeId: era.routeId || era.id })
              }
            }}
            style={{ ...timelineItemStyle, opacity: era.enabled ? 1 : 0.43, cursor: era.enabled ? 'pointer' : 'not-allowed' }}
          >
            <span style={timelineDotStyle}>{index + 1}</span>
            <div>
              <strong>{getDisplayName(era, appLanguage)}</strong>
              <p>{era.period} · {appLanguage === 'en' ? era.descriptionEn : era.description}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function CivilizationScreen({ appLanguage, selectedSubject, selectedEra, setSelectedRoute, setCurrentScreen, enterContent }) {
  const subject = getSubject(selectedSubject)
  const era = getEra(selectedSubject, selectedEra)
  const routes = era?.routes || []

  return (
    <section style={styles.section}>
      <button onClick={() => setCurrentScreen('timeline')} style={backButtonStyle}>← {appLanguage === 'en' ? 'Timeline' : '타임라인으로'}</button>
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.goldEyebrow}>{getDisplayName(subject, appLanguage)} · {getDisplayName(era, appLanguage)}</p>
          <h2 style={styles.sectionTitle}>{appLanguage === 'en' ? 'Choose a Civilization' : '문명/국가 선택'}</h2>
        </div>
      </div>
      <div style={civilGridStyle}>
        {routes.map((route) => (
          <button
            key={route.id}
            disabled={!route.enabled}
            onClick={() => {
              if (!route.enabled) return
              setSelectedRoute(route.id)
              enterContent({ eraId: era.id, routeId: route.id })
            }}
            style={{ ...civilCardStyle, opacity: route.enabled ? 1 : 0.45, cursor: route.enabled ? 'pointer' : 'not-allowed' }}
          >
            <strong>{getDisplayName(route, appLanguage)}</strong>
            <span>{route.enabled ? (appLanguage === 'en' ? 'Select language level' : '언어 난이도 선택으로') : (appLanguage === 'en' ? 'Coming soon' : '준비중')}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function DifficultyScreen({ appLanguage, selectedDifficulty, setSelectedDifficulty, setActiveTab, setCurrentScreen, setCurrentLessonIndex, currentContentKey }) {
  const levels = [
    { id: 1, name: 'Beginner', ko: '초급', desc: '짧은 문장과 기본 단어로 역사 개념을 익힙니다.', sample: 'The king won many wars.' },
    { id: 2, name: 'Intermediate', ko: '중급', desc: '확장된 문장과 역사 핵심 어휘를 학습합니다.', sample: 'The king expanded his territory.' },
    { id: 3, name: 'Advanced', ko: '고급', desc: '추상어와 학술 표현으로 역사 문장을 다룹니다.', sample: 'The monarch consolidated regional hegemony.' }
  ]

  return (
    <section style={styles.section}>
      <button onClick={() => setCurrentScreen('timeline')} style={backButtonStyle}>← {appLanguage === 'en' ? 'Timeline' : '타임라인으로'}</button>
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.goldEyebrow}>{currentContentKey} · Language Level</p>
          <h2 style={styles.sectionTitle}>{appLanguage === 'en' ? 'Choose Language Level' : '언어 난이도 선택'}</h2>
        </div>
      </div>
      <div style={worldIntroStyle}>
        <strong>{appLanguage === 'en' ? 'This is language difficulty, not history difficulty.' : '역사 난이도가 아니라 언어 난이도입니다.'}</strong>
        <p>{appLanguage === 'en' ? 'The same historical topic is learned through easier or harder sentences.' : '같은 역사 내용을 초급·중급·고급 영어 표현으로 다르게 학습합니다.'}</p>
      </div>
      <div style={worldGridStyle}>
        {levels.map((level) => (
          <button key={level.id} onClick={() => setSelectedDifficulty(level.id)} style={{ ...difficultyCardStyle, borderColor: selectedDifficulty === level.id ? '#d6b35a' : 'rgba(148,163,184,0.22)' }}>
            <div style={worldCardTopStyle}>
              <strong>{level.ko} · {level.name}</strong>
              <span style={selectedDifficulty === level.id ? playableBadgeStyle : comingSoonBadgeStyle}>{selectedDifficulty === level.id ? '선택됨' : '선택'}</span>
            </div>
            <p style={worldCardTextStyle}>{level.desc}</p>
            <p style={difficultySampleStyle}>{level.sample}</p>
          </button>
        ))}
      </div>
      <button onClick={() => { setCurrentLessonIndex(0); setActiveTab('quiz'); setCurrentScreen('content') }} style={styles.goldButton}>
        {appLanguage === 'en' ? 'Start Quest' : '퀘스트 시작'}
      </button>
    </section>
  )
}

function QuizTab({ t, appLanguage, currentLesson, currentLessonIndex, lessons, selectedChoice, resultMessage, rewardMessage, packResult, setPackResult, handleAnswer, goNextQuiz, quizCorrectCount }) {
  if (!currentLesson) {
    return <section style={styles.section}><h2>{t.quiz.title}</h2><p>{t.quiz.noQuiz}</p></section>
  }

  const answeredCorrectly = resultMessage === t.quiz.correct

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div><p style={styles.goldEyebrow}>{t.quiz.eyebrow}</p><h2 style={styles.sectionTitle}>{t.quiz.title}</h2></div>
        <span style={styles.pill}>{currentLessonIndex + 1} / {lessons.length}</span>
      </div>
      <div style={styles.languageBox}>
        <strong>History Phrase</strong>
        <p>{lessonQuestion(currentLesson, 'en') || lessonQuestion(currentLesson, appLanguage)}</p>
      </div>
      <div style={styles.hintBox}>{t.quiz.hint} · {quizCorrectCount}/5</div>
      <div style={styles.quizCard}>
        <p style={styles.quizLabel}>{t.quiz.question}</p>
        <h3 style={styles.question}>{lessonQuestion(currentLesson, appLanguage)}</h3>
        <div style={styles.choiceGrid}>
          {[1, 2, 3, 4].map((number) => {
            const isSelected = selectedChoice === number
            const isCorrectChoice = Number(number) === Number(currentLesson.answer)
            let buttonStyle = styles.choiceButton
            if (isSelected) buttonStyle = { ...buttonStyle, border: '1px solid #d6b35a', background: '#1e293b' }
            if (answeredCorrectly && isCorrectChoice) buttonStyle = { ...buttonStyle, border: '1px solid #22c55e', background: '#064e3b' }
            return <button key={number} onClick={() => handleAnswer(number)} disabled={answeredCorrectly} style={buttonStyle}><b>{number}</b><span>{lessonChoice(currentLesson, number, appLanguage)}</span></button>
          })}
        </div>
        {resultMessage && (
          <div style={{ ...styles.resultBox, borderColor: answeredCorrectly ? '#22c55e' : '#ef4444' }}>
            <strong style={{ color: answeredCorrectly ? '#86efac' : '#fecaca' }}>{resultMessage}</strong>
            {rewardMessage && <p style={{ margin: '6px 0 0' }}>{rewardMessage}</p>}
            {answeredCorrectly && lessonExplanation(currentLesson, appLanguage) && <p style={styles.explanation}>{lessonExplanation(currentLesson, appLanguage)}</p>}
            {packResult && <CardPackResult packResult={packResult} appLanguage={appLanguage} setPackResult={setPackResult} />}
          </div>
        )}
        {answeredCorrectly && <button onClick={goNextQuiz} style={styles.goldButton}>{t.quiz.next}</button>}
      </div>
    </section>
  )
}

function CardPackResult({ packResult, appLanguage, setPackResult }) {
  if (!packResult) return null
  const difficultyLabel = getDifficultyLabel(packResult.difficulty, appLanguage)
  return (
    <div style={packResultBoxStyle}>
      <div style={packHeaderStyle}>
        <div><p style={styles.goldEyebrow}>CARD PACK OPENED</p><h3 style={{ margin: '4px 0 0' }}>{packResult.name}</h3></div>
        <span style={playableBadgeStyle}>{difficultyLabel}</span>
      </div>
      <div style={packCardsGridStyle}>
        {packResult.cards.map((card, index) => {
          const rarityStyle = getRarityStyle(card?.rarity)
          return (
            <div key={`${card.id}-${index}`} style={{ ...packMiniCardStyle, borderColor: rarityStyle.border, background: rarityStyle.cardBackground }}>
              <span style={{ ...styles.rarityBadge, ...rarityStyle.badge }}>{card?.rarity || 'N'}</span>
              <CardImage card={card} size="normal" appLanguage={appLanguage} />
              <strong>{cardName(card, appLanguage)}</strong>
            </div>
          )
        })}
      </div>
      <button onClick={() => setPackResult(null)} style={styles.goldButton}>{appLanguage === 'en' ? 'OK' : '확인'}</button>
    </div>
  )
}

function RoadmapTab({ t, appLanguage, roadmapNodes, allCards, ownedCardIds, ownedCount, totalCount, collectionRate, selectedNode, setSelectedNode }) {
  const nodes = roadmapNodes.length > 0
    ? roadmapNodes
    : allCards.map((card, index) => ({
      node_id: card.id,
      card_id: card.id,
      label: card.name,
      label_en: card.name_en,
      category: card.category,
      category_en: card.category_en,
      roadmap_group: card.era,
      roadmap_group_en: card.era_en,
      year_start: card.year_start,
      x_column: (index % 4) + 1,
      y_order: Math.floor(index / 4) + 1
    }))

  const maxY = Math.max(...nodes.map((node) => Number(node.y_order || 1)), 1)
  const mapHeight = maxY * 92 + 110
  const mapWidth = 392

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div><p style={styles.goldEyebrow}>{t.roadmap.eyebrow}</p><h2 style={styles.sectionTitle}>{t.roadmap.title}</h2></div>
        <span style={styles.pill}>{ownedCount}/{totalCount}</span>
      </div>
      <div style={styles.roadmapSummary}><strong>{t.roadmap.desc}</strong><div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${collectionRate}%` }} /></div></div>
      <div style={styles.roadmapScroll}>
        <div style={{ ...styles.roadmapCanvas, width: mapWidth, height: mapHeight }}>
          {[1, 2, 3, 4].map((column) => <div key={column} style={{ ...styles.roadmapVerticalLine, left: `${(column - 1) * 92 + 48}px` }} />)}
          {[3, 5, 8, 11].map((row) => <div key={row} style={{ ...styles.roadmapHorizontalLine, top: `${row * 92 - 34}px` }} />)}
          {nodes.map((node) => {
            const owned = ownedCardIds.includes(node.card_id)
            const left = (Number(node.x_column || 1) - 1) * 92 + 8
            const top = (Number(node.y_order || 1) - 1) * 92 + 22
            return (
              <button key={node.node_id || node.card_id} onClick={() => setSelectedNode(node)} style={{ ...styles.roadmapNode, ...getRoadmapNodeStyle(node, owned), left, top }}>
                <span style={styles.roadmapYear}>{node.year_start || ''}</span>
                <strong>{owned ? nodeLabel(node, appLanguage) : getLockedLabel(node, appLanguage)}</strong>
              </button>
            )
          })}
        </div>
      </div>
      <div style={styles.nodeDetail}>
        {selectedNode ? <RoadmapNodeDetail t={t} appLanguage={appLanguage} node={selectedNode} owned={ownedCardIds.includes(selectedNode.card_id)} card={allCards.find((card) => card.id === selectedNode.card_id)} /> : <><strong>{t.roadmap.tap}</strong><p style={{ color: '#94a3b8' }}>{t.roadmap.desc}</p></>}
      </div>
    </section>
  )
}

function RoadmapNodeDetail({ t, appLanguage, node, owned, card }) {
  return (
    <div>
      <div style={styles.badgeRow}>
        <span style={owned ? styles.unlockedBadge : styles.lockedBadge}>{owned ? t.roadmap.unlocked : t.roadmap.locked}</span>
        <span style={styles.groupBadge}>{nodeGroup(node, appLanguage) || cardEra(card, appLanguage)}</span>
      </div>
      <h3 style={{ margin: '10px 0 6px' }}>{owned ? nodeLabel(node, appLanguage) : t.roadmap.lockedQuest}</h3>
      <p style={{ margin: '0 0 8px', color: '#94a3b8', lineHeight: 1.45 }}>{owned ? cardFlavor(card, appLanguage) : `${nodeCategory(node, appLanguage)} · ${t.collection.unlockHint}`}</p>
    </div>
  )
}

function ProfileTab({ t, appLanguage, changeAppLanguage, user, profile, ownedCount, totalCount, collectionRate, logout }) {
  const nickname = user.user_metadata?.name || user.user_metadata?.full_name || user.email
  return (
    <section style={styles.section}>
      <div style={styles.profileCard}>
        <div style={styles.profileAvatar}>{String(nickname || '?').slice(0, 1).toUpperCase()}</div>
        <h2 style={{ margin: '12px 0 4px' }}>{nickname}</h2>
        <p style={{ margin: 0, color: '#94a3b8' }}>{t.profile.explorer}</p>
      </div>
      <div style={styles.profileStatGrid}>
        <div style={styles.profileStat}><strong>{profile?.level ?? 1}</strong><span>{t.profile.level}</span></div>
        <div style={styles.profileStat}><strong>{profile?.exp ?? 0}</strong><span>{t.profile.exp}</span></div>
        <div style={styles.profileStat}><strong>{ownedCount}/{totalCount}</strong><span>{t.profile.quest}</span></div>
        <div style={styles.profileStat}><strong>{collectionRate}%</strong><span>{t.profile.completion}</span></div>
      </div>
      <div style={styles.settingsBox}>
        <div><strong>{t.profile.appLanguage}</strong><button onClick={changeAppLanguage} style={styles.smallGoldButton}>🌐 {appLanguage === 'ko' ? '한국어 → English' : 'English → 한국어'}</button></div>
        <div><strong>{t.profile.studyLanguage}</strong><p style={{ margin: '6px 0 0', color: '#94a3b8' }}>English</p></div>
      </div>
      <button onClick={logout} style={styles.logoutButton}>{t.profile.logout}</button>
    </section>
  )
}

function getRoadmapNodeStyle(node, owned) {
  if (!owned) return { background: '#334155', borderColor: '#64748b', color: '#cbd5e1' }
  const category = node.category
  if (category === '인물') return { background: '#7e22ce', borderColor: '#c084fc', color: 'white' }
  if (category === '전쟁') return { background: '#b91c1c', borderColor: '#f87171', color: 'white' }
  if (category === '건축' || category === '복식') return { background: '#c2410c', borderColor: '#fb923c', color: 'white' }
  if (category === '예술' || category === '사상') return { background: '#166534', borderColor: '#4ade80', color: 'white' }
  if (category === '유물' || category === '제도') return { background: '#475569', borderColor: '#cbd5e1', color: 'white' }
  return { background: '#4338ca', borderColor: '#818cf8', color: 'white' }
}

const tabStyle = (active) => ({
  border: 0,
  borderRadius: '18px',
  padding: '9px 4px',
  background: active ? 'linear-gradient(135deg, #d6b35a, #b8892f)' : 'transparent',
  color: active ? '#1c1204' : '#cbd5e1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
  fontWeight: 900,
  cursor: 'pointer',
  fontSize: '12px'
})

const worldIntroStyle = { padding: '16px', borderRadius: '20px', background: 'rgba(214,179,90,0.10)', border: '1px solid rgba(214,179,90,0.22)', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '14px' }
const worldGridStyle = { display: 'grid', gap: '12px' }
const worldCardTopStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '18px' }
const worldCardTextStyle = { margin: '10px 0 0', color: '#94a3b8', fontSize: '13px', lineHeight: 1.4 }
const playableBadgeStyle = { padding: '5px 8px', borderRadius: '999px', background: 'rgba(34,197,94,0.16)', color: '#86efac', fontSize: '11px', fontWeight: 900, whiteSpace: 'nowrap' }
const comingSoonBadgeStyle = { padding: '5px 8px', borderRadius: '999px', background: 'rgba(148,163,184,0.16)', color: '#cbd5e1', fontSize: '11px', fontWeight: 900, whiteSpace: 'nowrap' }
const miniProgressTrackStyle = { height: '9px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }
const miniProgressFillStyle = { height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #22c55e, #d6b35a)' }
const backButtonStyle = { border: '1px solid rgba(214,179,90,0.24)', borderRadius: '999px', padding: '8px 12px', background: 'rgba(15,23,42,0.86)', color: '#facc15', fontWeight: 900, cursor: 'pointer', marginBottom: '14px' }

const mapPanelStyle = { padding: '14px', borderRadius: '28px', background: 'linear-gradient(135deg, #020617, #0f172a)', border: '1px solid rgba(214,179,90,0.22)', marginBottom: '14px', overflow: 'hidden' }
const mapToolbarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#cbd5e1', fontSize: '12px', fontWeight: 800 }
const mapToolButtonsStyle = { display: 'flex', gap: '6px', flex: '0 0 auto' }
const mapToolButtonStyle = { border: '1px solid rgba(214,179,90,0.3)', borderRadius: '999px', padding: '6px 9px', background: 'rgba(15,23,42,0.92)', color: '#facc15', fontWeight: 900, cursor: 'pointer', fontSize: '12px' }
const mapViewportStyle = { position: 'relative', height: '360px', borderRadius: '24px', overflow: 'hidden', background: '#020617', border: '1px solid rgba(148,163,184,0.18)', touchAction: 'none', userSelect: 'none' }
const mapLayerStyle = { position: 'absolute', left: 0, top: 0, width: '720px', height: '405px', transformOrigin: 'center center', transition: 'transform 0.06s linear' }
const mapImageStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }
const mapRegionButtonStyle = { position: 'absolute', minWidth: '86px', border: '1px solid rgba(214,179,90,0.45)', borderRadius: '18px', padding: '8px 8px', background: 'rgba(15,23,42,0.82)', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '13px', fontWeight: 900, transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease', WebkitTapHighlightColor: 'transparent' }
const flagBubbleStyle = { width: '34px', height: '34px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '2px' }

const timelineWrapStyle = { position: 'relative', display: 'grid', gap: '12px', paddingLeft: '8px' }
const timelineItemStyle = { width: '100%', border: '1px solid rgba(214,179,90,0.24)', borderRadius: '22px', padding: '14px', background: 'linear-gradient(135deg, #0f172a, #111827)', color: '#f8fafc', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }
const timelineDotStyle = { width: '34px', height: '34px', borderRadius: '999px', background: 'linear-gradient(135deg, #d6b35a, #b8892f)', color: '#1c1204', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flex: '0 0 auto' }
const civilGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }
const civilCardStyle = { minHeight: '116px', border: '1px solid rgba(214,179,90,0.24)', borderRadius: '22px', padding: '14px', background: 'linear-gradient(135deg, #0f172a, #111827)', color: '#f8fafc', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }
const difficultyCardStyle = { width: '100%', border: '1px solid rgba(148,163,184,0.22)', borderRadius: '22px', padding: '16px', background: 'linear-gradient(135deg, #0f172a, #111827)', color: '#f8fafc', textAlign: 'left', boxShadow: '0 12px 24px rgba(0,0,0,0.24)', cursor: 'pointer' }
const difficultySampleStyle = { margin: '10px 0 0', padding: '10px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', color: '#bfdbfe', fontSize: '13px', lineHeight: 1.4 }

const packResultBoxStyle = { marginTop: '14px', padding: '16px', borderRadius: '24px', background: 'linear-gradient(135deg, #2a2115, #111827)', border: '1px solid rgba(214,179,90,0.5)', boxShadow: '0 16px 36px rgba(214,179,90,0.18)' }
const packHeaderStyle = { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }
const packCardsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }
const packMiniCardStyle = { padding: '10px', borderRadius: '18px', border: '1px solid', color: '#f8fafc', display: 'grid', gap: '7px', fontSize: '13px' }

const styles = {
  page: { minHeight: '100vh', background: '#020617', margin: 0, padding: 0, color: '#f8fafc', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  shell: { width: '100%', maxWidth: '430px', minHeight: '100vh', margin: '0 auto', background: 'linear-gradient(180deg, #020617, #0f172a 42%, #111827)', padding: '18px 16px 96px', boxSizing: 'border-box' },
  hero: { borderRadius: '28px', padding: '22px', background: 'radial-gradient(circle at 80% 20%, rgba(214,179,90,0.25), transparent 28%), linear-gradient(135deg, #111827, #1e1b4b 58%, #3b1d0b)', color: 'white', border: '1px solid rgba(214,179,90,0.28)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)', marginBottom: '20px' },
  heroTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' },
  heroButtons: { display: 'flex', gap: 6, alignItems: 'center' },
  heroEyebrow: { margin: '0 0 4px', color: '#d6b35a', fontSize: '11px', fontWeight: 900, letterSpacing: '0.7px' },
  title: { margin: 0, fontSize: '36px', letterSpacing: '-1px', color: '#f8fafc' },
  heroText: { margin: '12px 0 18px', color: '#cbd5e1', lineHeight: 1.5 },
  langButton: { border: '1px solid rgba(214,179,90,0.35)', borderRadius: '999px', padding: '8px 10px', background: 'rgba(15,23,42,0.65)', color: 'white', fontWeight: 900, fontSize: '12px', cursor: 'pointer' },
  levelBadge: { padding: '8px 11px', borderRadius: '999px', background: 'rgba(214,179,90,0.18)', border: '1px solid rgba(214,179,90,0.3)', fontWeight: 800, fontSize: '13px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' },
  progressTrack: { height: '12px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #22c55e, #d6b35a)', transition: 'width 0.35s ease' },
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '16px' },
  statBox: { padding: '11px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'center' },
  section: { marginTop: '18px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  goldEyebrow: { margin: '0 0 4px', color: '#d6b35a', fontSize: '13px', fontWeight: 900 },
  sectionTitle: { margin: 0, fontSize: '25px', letterSpacing: '-0.4px', color: '#f8fafc' },
  pill: { padding: '7px 10px', borderRadius: '999px', background: 'rgba(214,179,90,0.16)', color: '#facc15', fontWeight: 800, fontSize: '13px', border: '1px solid rgba(214,179,90,0.25)' },
  languageBox: { padding: '15px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))', border: '1px solid rgba(214,179,90,0.2)', color: '#e2e8f0', marginBottom: '12px', lineHeight: 1.45 },
  hintBox: { padding: '14px', borderRadius: '18px', background: 'rgba(59,130,246,0.12)', color: '#bfdbfe', marginBottom: '12px', fontSize: '14px', lineHeight: 1.45 },
  quizCard: { padding: '18px', borderRadius: '24px', background: '#0f172a', border: '1px solid rgba(148,163,184,0.22)', boxShadow: '0 14px 30px rgba(0,0,0,0.38)' },
  quizLabel: { margin: 0, color: '#94a3b8', fontSize: '13px', fontWeight: 800 },
  question: { margin: '8px 0 16px', fontSize: '20px', lineHeight: 1.5, color: '#f8fafc' },
  choiceGrid: { display: 'grid', gap: '10px' },
  choiceButton: { width: '100%', display: 'flex', gap: '10px', alignItems: 'center', padding: '14px', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.28)', background: '#111827', color: '#f8fafc', fontSize: '15px', textAlign: 'left', cursor: 'pointer' },
  resultBox: { marginTop: '16px', padding: '15px', borderRadius: '18px', border: '1px solid', background: '#020617', color: '#e2e8f0' },
  explanation: { margin: '10px 0 0', padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', lineHeight: 1.45, fontSize: '13px' },
  goldButton: { width: '100%', border: 0, borderRadius: '16px', padding: '14px 16px', background: 'linear-gradient(135deg, #d6b35a, #b8892f)', color: '#1c1204', fontWeight: 900, fontSize: '15px', cursor: 'pointer', marginTop: '14px' },
  roadmapSummary: { padding: '15px', borderRadius: '20px', background: '#0f172a', border: '1px solid rgba(214,179,90,0.18)', color: '#e2e8f0', marginBottom: '12px', lineHeight: 1.45 },
  roadmapScroll: { overflowX: 'auto', background: '#020617', borderRadius: '24px', padding: '14px', boxShadow: '0 14px 30px rgba(0,0,0,0.4)', border: '1px solid rgba(148,163,184,0.18)' },
  roadmapCanvas: { position: 'relative', background: '#020617', borderRadius: '18px', overflow: 'hidden' },
  roadmapVerticalLine: { position: 'absolute', top: 20, bottom: 20, width: '3px', background: '#f97316', opacity: 0.9 },
  roadmapHorizontalLine: { position: 'absolute', left: 34, right: 34, height: '3px', background: '#f97316', opacity: 0.85 },
  roadmapNode: { position: 'absolute', width: '80px', minHeight: '54px', borderRadius: '16px', border: '3px solid', padding: '7px 6px', zIndex: 3, fontSize: '11px', fontWeight: 900, lineHeight: 1.25, textAlign: 'center', cursor: 'pointer', boxShadow: '0 8px 18px rgba(0,0,0,0.38)' },
  roadmapYear: { display: 'block', fontSize: '9px', opacity: 0.85, marginBottom: '3px' },
  nodeDetail: { marginTop: '14px', padding: '16px', borderRadius: '20px', background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', boxShadow: '0 8px 20px rgba(0,0,0,0.24)' },
  badgeRow: { display: 'flex', gap: '7px', flexWrap: 'wrap' },
  unlockedBadge: { padding: '5px 8px', borderRadius: '999px', background: 'rgba(34,197,94,0.16)', color: '#86efac', fontSize: '12px', fontWeight: 900 },
  lockedBadge: { padding: '5px 8px', borderRadius: '999px', background: 'rgba(148,163,184,0.16)', color: '#cbd5e1', fontSize: '12px', fontWeight: 900 },
  groupBadge: { padding: '5px 8px', borderRadius: '999px', background: 'rgba(214,179,90,0.16)', color: '#facc15', fontSize: '12px', fontWeight: 900 },
  rarityBadge: { padding: '4px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 900 },
  bottomNav: { position: 'fixed', left: '50%', bottom: '14px', transform: 'translateX(-50%)', width: 'calc(100% - 28px)', maxWidth: '398px', padding: '8px', borderRadius: '24px', background: 'rgba(2, 6, 23, 0.94)', border: '1px solid rgba(214,179,90,0.18)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', boxShadow: '0 16px 36px rgba(0,0,0,0.48)', zIndex: 20 },
  profileCard: { padding: '24px', borderRadius: '28px', background: '#0f172a', border: '1px solid rgba(214,179,90,0.18)', textAlign: 'center', boxShadow: '0 14px 30px rgba(0,0,0,0.32)' },
  profileAvatar: { width: '72px', height: '72px', margin: '0 auto', borderRadius: '24px', background: 'linear-gradient(135deg, #d6b35a, #7c2d12)', color: '#1c1204', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 900 },
  profileStatGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' },
  profileStat: { padding: '16px', borderRadius: '20px', background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' },
  settingsBox: { marginTop: '16px', padding: '16px', borderRadius: '22px', background: '#0f172a', border: '1px solid rgba(214,179,90,0.18)', display: 'grid', gap: '14px' },
  smallGoldButton: { marginTop: '8px', border: 0, borderRadius: '999px', padding: '9px 12px', background: 'linear-gradient(135deg, #d6b35a, #b8892f)', color: '#1c1204', fontWeight: 900, cursor: 'pointer' },
  logoutButton: { width: '100%', marginTop: '16px', padding: '14px', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.3)', background: '#111827', color: '#f8fafc', fontWeight: 900, cursor: 'pointer' },
  errorBox: { padding: '14px', borderRadius: '16px', background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#fecaca', marginBottom: '14px' }
}
