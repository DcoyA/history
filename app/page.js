'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const dictionaries = {
  ko: {
    appTitle: 'Hi-Story',
    heroLabel: '고구려 퀘스트',
    heroText: '역사 흐름을 따라가며 언어 카드와 도감을 완성하세요.',
    progress: '고구려 진행도',
    completed: '완료',
    remaining: '남은 퀘스트',
    total: '전체',
    googleStart: 'Google로 시작하기',

    tabs: {
      quiz: '퀴즈',
      roadmap: '로드맵',
      collection: '도감',
      profile: '내정보'
    },

    quiz: {
      eyebrow: '오늘의 도전',
      title: '고구려 퀴즈',
      currentQuest: '현재 퀘스트',
      questHint: '정답을 맞히면 연결된 역사 카드와 언어 학습 표현이 해금됩니다.',
      question: '문제',
      next: '다음 문제로',
      correct: '정답입니다!',
      wrong: '오답입니다',
      tryAgain: '괜찮습니다. 다시 골라보세요.',
      newCard: '새 카드 획득',
      countUp: '카드 수량이 증가했습니다.',
      reward: '획득 보상',
      rewardError: '보상 카드 정보를 불러오지 못했습니다.',
      cardError: '카드 확인 중 오류가 발생했습니다.',
      saveError: '카드 저장 중 오류가 발생했습니다.'
    },

    roadmap: {
      eyebrow: '전체 흐름',
      title: '고구려 로드맵',
      summaryTitle: '이 앱의 핵심 커리큘럼입니다.',
      summaryText: '퀴즈를 풀면 아래 역사 노드가 하나씩 컬러로 해금됩니다.',
      tapNode: '노드를 눌러보세요',
      tapNodeDesc: '각 퀘스트가 어떤 역사 흐름에 속하는지 확인할 수 있습니다.',
      unlocked: '해금 완료',
      locked: '미해금',
      lockedQuest: '아직 해금되지 않은 퀘스트',
      yearFlow: '년대 흐름'
    },

    collection: {
      eyebrow: '수집 현황',
      title: '내 도감',
      owned: '획득한 카드',
      locked: '미획득 카드',
      empty: '아직 획득한 카드가 없습니다.',
      complete: '고구려 도감을 모두 완성했습니다!',
      undiscovered: '미발견 카드',
      unlockHint: '퀴즈를 풀어 해금',
      acquired: '획득',
      undiscoveredCount: '미발견'
    },

    profile: {
      explorer: '고구려 로드맵 탐험가',
      level: '레벨',
      exp: '경험치',
      quest: '퀘스트',
      completion: '완성도',
      appLanguage: '앱 언어',
      studyLanguage: '학습 언어',
      studyLanguageValue: 'English',
      expansionTitle: '서비스 확장 방향',
      expansionText: '고구려 로드맵을 완성하면 백제, 신라, 고려, 조선 로드맵으로 확장할 수 있습니다.',
      logout: '로그아웃'
    },

    status: {
      loading: '불러오는 중...',
      userLoadFail: '사용자 정보를 불러오지 못했습니다.',
      profileSaveFail: '프로필 저장에 실패했습니다.',
      cardsLoadFail: '전체 카드 정보를 불러오지 못했습니다.',
      ownedCardsLoadFail: '보유 카드 정보를 불러오지 못했습니다.',
      lessonLoadFail: '퀴즈 정보를 불러오지 못했습니다.'
    }
  },

  en: {
    appTitle: 'Hi-Story',
    heroLabel: 'Goguryeo Quest',
    heroText: 'Follow historical milestones and unlock language learning cards.',
    progress: 'Goguryeo Progress',
    completed: 'Done',
    remaining: 'Quests Left',
    total: 'Total',
    googleStart: 'Continue with Google',

    tabs: {
      quiz: 'Quiz',
      roadmap: 'Roadmap',
      collection: 'Cards',
      profile: 'Profile'
    },

    quiz: {
      eyebrow: "Today's Challenge",
      title: 'Goguryeo Quiz',
      currentQuest: 'Current Quest',
      questHint: 'Answer correctly to unlock a history card and a language expression.',
      question: 'Question',
      next: 'Next Question',
      correct: 'Correct!',
      wrong: 'Not quite',
      tryAgain: 'No worries. Try again.',
      newCard: 'New card unlocked',
      countUp: 'Card count increased.',
      reward: 'Reward',
      rewardError: 'Could not load the reward card.',
      cardError: 'There was an error checking the card.',
      saveError: 'There was an error saving the card.'
    },

    roadmap: {
      eyebrow: 'Full Journey',
      title: 'Goguryeo Roadmap',
      summaryTitle: 'This is the core learning journey.',
      summaryText: 'Each historical node is unlocked as you answer quizzes.',
      tapNode: 'Tap a node',
      tapNodeDesc: 'See how each quest connects to the historical flow.',
      unlocked: 'Unlocked',
      locked: 'Locked',
      lockedQuest: 'Locked quest',
      yearFlow: 's flow'
    },

    collection: {
      eyebrow: 'Collection',
      title: 'My Cards',
      owned: 'Unlocked Cards',
      locked: 'Locked Cards',
      empty: 'You have not unlocked any cards yet.',
      complete: 'You completed the Goguryeo collection!',
      undiscovered: 'Undiscovered Card',
      unlockHint: 'Unlock through quizzes',
      acquired: 'Unlocked',
      undiscoveredCount: 'Locked'
    },

    profile: {
      explorer: 'Goguryeo Roadmap Explorer',
      level: 'Level',
      exp: 'EXP',
      quest: 'Quests',
      completion: 'Completion',
      appLanguage: 'App Language',
      studyLanguage: 'Study Language',
      studyLanguageValue: 'English',
      expansionTitle: 'Expansion Plan',
      expansionText: 'After Goguryeo, this can expand to Baekje, Silla, Goryeo, and Joseon.',
      logout: 'Log out'
    },

    status: {
      loading: 'Loading...',
      userLoadFail: 'Could not load user information.',
      profileSaveFail: 'Could not save your profile.',
      cardsLoadFail: 'Could not load card data.',
      ownedCardsLoadFail: 'Could not load your cards.',
      lessonLoadFail: 'Could not load quiz data.'
    }
  }
}

function getText(language) {
  return dictionaries[language] || dictionaries.ko
}

export default function Home() {
  const [appLanguage, setAppLanguage] = useState('ko')
  const t = getText(appLanguage)

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [lessons, setLessons] = useState([])
  const [allCards, setAllCards] = useState([])
  const [roadmapNodes, setRoadmapNodes] = useState([])
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [ownedCards, setOwnedCards] = useState([])
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [resultMessage, setResultMessage] = useState('')
  const [rewardMessage, setRewardMessage] = useState('')
  const [lastRewardCard, setLastRewardCard] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState('quiz')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('hiStoryAppLanguage')
    if (savedLanguage) {
      setAppLanguage(savedLanguage)
    }

    loadData()
  }, [])

  const changeAppLanguage = () => {
    const nextLanguage = appLanguage === 'ko' ? 'en' : 'ko'
    setAppLanguage(nextLanguage)
    localStorage.setItem('hiStoryAppLanguage', nextLanguage)
  }

  const loadData = async () => {
    setLoading(true)
    setErrorMessage('')

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('사용자 조회 실패:', userError)
      setErrorMessage(t.status.userLoadFail)
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

    const { data: savedProfile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: currentUser.id,
        nickname,
        level: 1,
        exp: 0
      })
      .select()
      .single()

    if (profileError) {
      console.error('프로필 저장 실패:', profileError)
      setErrorMessage(t.status.profileSaveFail)
    } else {
      setProfile(savedProfile)
    }

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
      console.error('전체 카드 조회 실패:', error)
      setErrorMessage(t.status.cardsLoadFail)
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
      console.error('퀴즈 조회 실패:', error)
      setErrorMessage(t.status.lessonLoadFail)
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
      console.error('로드맵 조회 실패:', error)
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
      console.error('보유 카드 조회 실패:', userCardsError)
      setErrorMessage(t.status.ownedCardsLoadFail)
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
      console.error('카드 상세 조회 실패:', cardsError)
      setErrorMessage(t.status.ownedCardsLoadFail)
      return
    }

    const mergedCards = userCardsData.map((userCard) => {
      const cardInfo = cardsData.find((card) => card.id === userCard.card_id)

      return {
        ...userCard,
        card: cardInfo
      }
    })

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

  const handleAnswer = async (choiceNumber) => {
    if (!user) return

    const currentLesson = lessons[currentLessonIndex]
    if (!currentLesson) return

    setSelectedChoice(choiceNumber)
    setResultMessage('')
    setRewardMessage('')
    setLastRewardCard(null)

    const isCorrect = choiceNumber === currentLesson.answer

    if (!isCorrect) {
      setResultMessage(t.quiz.wrong)
      setRewardMessage(t.quiz.tryAgain)
      return
    }

    const rewardCardId = currentLesson.reward_card_id

    const { data: rewardCard, error: rewardCardError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', rewardCardId)
      .single()

    if (rewardCardError) {
      console.error('보상 카드 조회 실패:', rewardCardError)
      setResultMessage(t.quiz.correct)
      setRewardMessage(t.quiz.rewardError)
      return
    }

    setLastRewardCard(rewardCard)

    const { data: existingCard, error: existingError } = await supabase
      .from('user_cards')
      .select('*')
      .eq('user_id', user.id)
      .eq('card_id', rewardCardId)
      .maybeSingle()

    if (existingError) {
      console.error('기존 카드 조회 실패:', existingError)
      setResultMessage(t.quiz.correct)
      setRewardMessage(t.quiz.cardError)
      return
    }

    if (existingCard) {
      const nextCount = (existingCard.count || 1) + 1

      const { error: updateError } = await supabase
        .from('user_cards')
        .update({
          count: nextCount
        })
        .eq('id', existingCard.id)

      if (updateError) {
        console.error('카드 수량 증가 실패:', updateError)
        setResultMessage(t.quiz.correct)
        setRewardMessage(t.quiz.saveError)
        return
      }

      setResultMessage(t.quiz.correct)
      setRewardMessage(`${rewardCard.name} ${t.quiz.countUp} x${nextCount}`)
    } else {
      const { error: insertError } = await supabase
        .from('user_cards')
        .insert({
          id: crypto.randomUUID(),
          user_id: user.id,
          card_id: rewardCardId,
          count: 1
        })

      if (insertError) {
        console.error('카드 지급 실패:', insertError)
        setResultMessage(t.quiz.correct)
        setRewardMessage(t.quiz.saveError)
        return
      }

      setResultMessage(t.quiz.correct)
      setRewardMessage(`${t.quiz.newCard}: ${rewardCard.name}`)
    }

    await loadOwnedCards(user.id)
    await loadAllCards()
    await loadRoadmapNodes()
  }

  const goNextQuiz = () => {
    setSelectedChoice(null)
    setResultMessage('')
    setRewardMessage('')
    setLastRewardCard(null)

    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    } else {
      setCurrentLessonIndex(0)
    }
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={phoneShellStyle}>
          <h1 style={{ marginTop: 40 }}>{t.appTitle}</h1>
          <p>{t.status.loading}</p>
        </div>
      </main>
    )
  }

  const currentLesson = lessons[currentLessonIndex]
  const ownedCardIds = ownedCards.map((item) => item.card_id)
  const ownedCount = ownedCards.length
  const totalCount = allCards.length
  const lockedCards = allCards.filter((card) => !ownedCardIds.includes(card.id))
  const collectionRate =
    totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0

  return (
    <main style={pageStyle}>
      <div style={phoneShellStyle}>
        <section style={heroStyle}>
          <div style={heroTopStyle}>
            <div>
              <p style={eyebrowStyle}>{t.heroLabel}</p>
              <h1 style={titleStyle}>{t.appTitle}</h1>
            </div>

            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={changeAppLanguage} style={languageButtonStyle}>
                🌐 {appLanguage.toUpperCase()}
              </button>

              {user && (
                <div style={levelBadgeStyle}>
                  Lv. {profile?.level ?? 1}
                </div>
              )}
            </div>
          </div>

          <p style={heroTextStyle}>
            {t.heroText}
          </p>

          {!user ? (
            <button onClick={login} style={primaryButtonStyle}>
              {t.googleStart}
            </button>
          ) : (
            <>
              <div style={progressHeaderStyle}>
                <span>{t.progress}</span>
                <strong>{collectionRate}%</strong>
              </div>

              <div style={progressTrackStyle}>
                <div
                  style={{
                    ...progressFillStyle,
                    width: `${collectionRate}%`
                  }}
                />
              </div>

              <div style={miniStatRowStyle}>
                <div style={miniStatStyle}>
                  <strong>{ownedCount}</strong>
                  <span>{t.completed}</span>
                </div>

                <div style={miniStatStyle}>
                  <strong>{lockedCards.length}</strong>
                  <span>{t.remaining}</span>
                </div>

                <div style={miniStatStyle}>
                  <strong>{totalCount}</strong>
                  <span>{t.total}</span>
                </div>
              </div>
            </>
          )}
        </section>

        {errorMessage && (
          <div style={errorBoxStyle}>
            {errorMessage}
          </div>
        )}

        {user && activeTab === 'quiz' && (
          <QuizView
            t={t}
            currentLesson={currentLesson}
            currentLessonIndex={currentLessonIndex}
            lessons={lessons}
            selectedChoice={selectedChoice}
            resultMessage={resultMessage}
            rewardMessage={rewardMessage}
            lastRewardCard={lastRewardCard}
            handleAnswer={handleAnswer}
            goNextQuiz={goNextQuiz}
          />
        )}

        {user && activeTab === 'roadmap' && (
          <RoadmapView
            t={t}
            roadmapNodes={roadmapNodes}
            allCards={allCards}
            ownedCardIds={ownedCardIds}
            ownedCount={ownedCount}
            totalCount={totalCount}
            collectionRate={collectionRate}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />
        )}

        {user && activeTab === 'collection' && (
          <CollectionView
            t={t}
            ownedCards={ownedCards}
            lockedCards={lockedCards}
            ownedCount={ownedCount}
            totalCount={totalCount}
            collectionRate={collectionRate}
          />
        )}

        {user && activeTab === 'profile' && (
          <ProfileView
            t={t}
            appLanguage={appLanguage}
            changeAppLanguage={changeAppLanguage}
            user={user}
            profile={profile}
            ownedCount={ownedCount}
            totalCount={totalCount}
            collectionRate={collectionRate}
            logout={logout}
          />
        )}

        {user && (
          <nav style={bottomNavStyle}>
            <button
              onClick={() => setActiveTab('quiz')}
              style={tabButtonStyle(activeTab === 'quiz')}
            >
              <span>⚔️</span>
              <small>{t.tabs.quiz}</small>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              style={tabButtonStyle(activeTab === 'roadmap')}
            >
              <span>🗺️</span>
              <small>{t.tabs.roadmap}</small>
            </button>

            <button
              onClick={() => setActiveTab('collection')}
              style={tabButtonStyle(activeTab === 'collection')}
            >
              <span>📚</span>
              <small>{t.tabs.collection}</small>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              style={tabButtonStyle(activeTab === 'profile')}
            >
              <span>👤</span>
              <small>{t.tabs.profile}</small>
            </button>
          </nav>
        )}
      </div>
    </main>
  )
}

function QuizView({
  t,
  currentLesson,
  currentLessonIndex,
  lessons,
  selectedChoice,
  resultMessage,
  rewardMessage,
  lastRewardCard,
  handleAnswer,
  goNextQuiz
}) {
  if (!currentLesson) {
    return (
      <section style={contentSectionStyle}>
        <h2>{t.quiz.title}</h2>
        <p>{t.status.lessonLoadFail}</p>
      </section>
    )
  }

  const answeredCorrectly = resultMessage === t.quiz.correct

  return (
    <section style={contentSectionStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <p style={eyebrowDarkStyle}>{t.quiz.eyebrow}</p>
          <h2 style={sectionTitleStyle}>{t.quiz.title}</h2>
        </div>

        <span style={pillStyle}>
          {currentLessonIndex + 1} / {lessons.length}
        </span>
      </div>

      <div style={questHintStyle}>
        <strong>{t.quiz.currentQuest}</strong>
        <span>{t.quiz.questHint}</span>
      </div>

      <div style={quizCardStyle}>
        <p style={quizLabelStyle}>{t.quiz.question}</p>
        <h3 style={questionStyle}>{currentLesson.question}</h3>

        <div style={choiceGridStyle}>
          {[1, 2, 3, 4].map((number) => {
            const choiceText = currentLesson[`choice${number}`]
            const isSelected = selectedChoice === number
            const isCorrectChoice = number === currentLesson.answer

            let style = choiceButtonStyle

            if (isSelected) {
              style = {
                ...style,
                border: '2px solid #111827',
                background: '#eef2ff'
              }
            }

            if (answeredCorrectly && isCorrectChoice) {
              style = {
                ...style,
                border: '2px solid #22c55e',
                background: '#dcfce7'
              }
            }

            return (
              <button
                key={number}
                onClick={() => handleAnswer(number)}
                disabled={answeredCorrectly}
                style={style}
              >
                <b>{number}</b>
                <span>{choiceText}</span>
              </button>
            )
          })}
        </div>

        {resultMessage && (
          <div
            style={{
              ...resultBoxStyle,
              background: answeredCorrectly ? '#ecfdf5' : '#fff1f2',
              borderColor: answeredCorrectly ? '#86efac' : '#fecdd3'
            }}
          >
            <strong
              style={{
                color: answeredCorrectly ? '#15803d' : '#be123c'
              }}
            >
              {resultMessage}
            </strong>

            {rewardMessage && (
              <p style={{ margin: '6px 0 0' }}>
                {rewardMessage}
              </p>
            )}

            {currentLesson.explanation && answeredCorrectly && (
              <p style={explanationStyle}>
                {currentLesson.explanation}
              </p>
            )}

            {lastRewardCard && (
              <RewardCard t={t} card={lastRewardCard} />
            )}
          </div>
        )}

        {answeredCorrectly && (
          <button onClick={goNextQuiz} style={primaryButtonDarkStyle}>
            {t.quiz.next}
          </button>
        )}
      </div>
    </section>
  )
}

function RoadmapView({
  t,
  roadmapNodes,
  allCards,
  ownedCardIds,
  ownedCount,
  totalCount,
  collectionRate,
  selectedNode,
  setSelectedNode
}) {
  const nodes = roadmapNodes.length > 0
    ? roadmapNodes
    : allCards.map((card, index) => ({
        node_id: card.id,
        card_id: card.id,
        label: card.name,
        era: card.era,
        category: card.category,
        roadmap_group: card.roadmap_group || '고구려',
        year_start: card.year_start,
        year_end: card.year_end,
        x_column: (index % 4) + 1,
        y_order: Math.floor(index / 4) + 1
      }))

  const maxY = Math.max(...nodes.map((node) => Number(node.y_order || 1)), 1)
  const mapHeight = maxY * 92 + 110
  const mapWidth = 392

  const grouped = ['국가 정비', '전성기 확장', '남진과 전성기', '수·당 전쟁', '생활 문화', '예술 문화', '방어 체계']

  return (
    <section style={contentSectionStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <p style={eyebrowDarkStyle}>{t.roadmap.eyebrow}</p>
          <h2 style={sectionTitleStyle}>{t.roadmap.title}</h2>
        </div>

        <span style={pillStyle}>
          {ownedCount}/{totalCount}
        </span>
      </div>

      <div style={roadmapSummaryStyle}>
        <strong>{t.roadmap.summaryTitle}</strong>
        <span>{t.roadmap.summaryText}</span>

        <div style={progressTrackLightStyle}>
          <div
            style={{
              ...progressFillLightStyle,
              width: `${collectionRate}%`
            }}
          />
        </div>
      </div>

      <div style={roadmapLegendStyle}>
        {grouped.map((group) => (
          <span key={group} style={legendPillStyle}>
            {group}
          </span>
        ))}
      </div>

      <div style={roadmapScrollStyle}>
        <div
          style={{
            ...roadmapCanvasStyle,
            width: mapWidth,
            height: mapHeight
          }}
        >
          {[1, 2, 3, 4].map((column) => (
            <div
              key={column}
              style={{
                ...roadmapVerticalLineStyle,
                left: `${(column - 1) * 92 + 48}px`
              }}
            />
          ))}

          {[3, 5, 8, 11].map((row) => (
            <div
              key={row}
              style={{
                ...roadmapHorizontalLineStyle,
                top: `${row * 92 - 34}px`
              }}
            />
          ))}

          {nodes.map((node) => {
            const owned = ownedCardIds.includes(node.card_id)
            const left = (Number(node.x_column || 1) - 1) * 92 + 8
            const top = (Number(node.y_order || 1) - 1) * 92 + 22

            return (
              <button
                key={node.node_id}
                onClick={() => setSelectedNode(node)}
                style={{
                  ...roadmapNodeStyle,
                  ...getRoadmapNodeStyle(node, owned),
                  left,
                  top
                }}
              >
                <span style={roadmapNodeYearStyle}>
                  {node.year_start || ''}
                </span>
                <strong>{owned ? node.label : getLockedLabel(node)}</strong>
              </button>
            )
          })}
        </div>
      </div>

      <div style={selectedNodeBoxStyle}>
        {selectedNode ? (
          <RoadmapNodeDetail
            t={t}
            node={selectedNode}
            owned={ownedCardIds.includes(selectedNode.card_id)}
            card={allCards.find((card) => card.id === selectedNode.card_id)}
          />
        ) : (
          <>
            <strong>{t.roadmap.tapNode}</strong>
            <p>{t.roadmap.tapNodeDesc}</p>
          </>
        )}
      </div>
    </section>
  )
}

function RoadmapNodeDetail({ t, node, owned, card }) {
  return (
    <div>
      <div style={nodeDetailTopStyle}>
        <span style={owned ? unlockedBadgeStyle : lockedBadgeStyle}>
          {owned ? t.roadmap.unlocked : t.roadmap.locked}
        </span>

        <span style={nodeGroupBadgeStyle}>
          {node.roadmap_group || '고구려'}
        </span>
      </div>

      <h3 style={{ margin: '10px 0 6px' }}>
        {owned ? node.label : t.roadmap.lockedQuest}
      </h3>

      <p style={{ margin: '0 0 8px', color: '#64748b', lineHeight: 1.45 }}>
        {owned
          ? card?.flavor_text || '퀴즈를 통해 해금한 고구려 카드입니다.'
          : `${node.category || '역사'} 카테고리의 고구려 퀘스트입니다. 관련 퀴즈를 풀면 공개됩니다.`}
      </p>

      <small style={{ color: '#6366f1', fontWeight: 800 }}>
        {node.year_start ? `${node.year_start}${t.roadmap.yearFlow}` : 'Goguryeo'} · {node.category || '카드'}
      </small>
    </div>
  )
}

function RewardCard({ t, card }) {
  const rarityStyle = getRarityStyle(card?.rarity)

  return (
    <div style={rewardCardStyle}>
      <div style={rewardTopRowStyle}>
        <span style={{ ...rarityBadgeStyle, ...rarityStyle.badge }}>
          {card?.rarity || 'N'}
        </span>

        <span style={rewardLabelStyle}>{t.quiz.reward}</span>
      </div>

      <CardImage card={card} size="large" />

      <h3 style={{ margin: '10px 0 4px', fontSize: 22 }}>
        {card?.name}
      </h3>

      <p style={{ margin: '0 0 8px', color: '#92400e', fontSize: 13 }}>
        {card?.era || '고구려'} · {card?.category || '카드'}
      </p>

      {card?.flavor_text && (
        <p style={rewardFlavorStyle}>
          {card.flavor_text}
        </p>
      )}
    </div>
  )
}

function CollectionView({
  t,
  ownedCards,
  lockedCards,
  ownedCount,
  totalCount,
  collectionRate
}) {
  return (
    <section style={contentSectionStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <p style={eyebrowDarkStyle}>{t.collection.eyebrow}</p>
          <h2 style={sectionTitleStyle}>{t.collection.title}</h2>
        </div>

        <span style={pillStyle}>
          {collectionRate}%
        </span>
      </div>

      <div style={collectionSummaryStyle}>
        <strong>
          {ownedCount}{t.collection.acquired}
        </strong>
        <span>
          {t.total} {totalCount} · {t.collection.undiscoveredCount} {lockedCards.length}
        </span>
      </div>

      <h3 style={subTitleStyle}>{t.collection.owned}</h3>

      {ownedCards.length === 0 ? (
        <div style={emptyBoxStyle}>
          {t.collection.empty}
        </div>
      ) : (
        <div style={cardGridStyle}>
          {ownedCards.map((item) => (
            <OwnedCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <h3 style={subTitleStyle}>{t.collection.locked}</h3>

      {lockedCards.length === 0 ? (
        <div style={completeBoxStyle}>
          {t.collection.complete}
        </div>
      ) : (
        <div style={cardGridStyle}>
          {lockedCards.map((card) => (
            <LockedCard key={card.id} t={t} card={card} />
          ))}
        </div>
      )}
    </section>
  )
}

function OwnedCard({ item }) {
  const card = item.card
  const rarityStyle = getRarityStyle(card?.rarity)

  return (
    <div
      style={{
        ...ownedCardStyle,
        border: `1px solid ${rarityStyle.border}`,
        background: rarityStyle.cardBackground
      }}
    >
      <div style={cardTopRowStyle}>
        <span style={{ ...rarityBadgeStyle, ...rarityStyle.badge }}>
          {card?.rarity || 'N'}
        </span>

        <span style={countBadgeStyle}>
          x{item.count || 1}
        </span>
      </div>

      <CardImage card={card} size="normal" />

      <h3 style={ownedCardTitleStyle}>
        {card?.name || '이름 없는 카드'}
      </h3>

      <p style={cardMetaStyle}>
        {card?.era || '고구려'} · {card?.category || '카드'}
      </p>

      {card?.flavor_text && (
        <p style={flavorTextStyle}>
          {card.flavor_text}
        </p>
      )}
    </div>
  )
}

function CardImage({ card, size }) {
  const isLarge = size === 'large'
  const height = isLarge ? 148 : 108
  const fontSize = isLarge ? 52 : 42

  if (card?.image_url) {
    return (
      <div
        style={{
          ...cardImageWrapStyle,
          height
        }}
      >
        {card.image_url}
      </div>
    )
  }

  return (
    <div
      style={{
        ...cardImagePlaceholderStyle,
        height,
        fontSize
      }}
    >
      {getCardIcon(card?.category)}
    </div>
  )
}

function LockedCard({ t, card }) {
  return (
    <div style={lockedCardStyle}>
      <div style={lockedGlowStyle} />

      <div style={lockedIconStyle}>
        ?
      </div>

      <h3 style={lockedTitleStyle}>
        ?????
      </h3>

      <p style={lockedTextStyle}>
        {card?.category || t.collection.undiscovered} · {t.collection.undiscovered}
      </p>

      <small style={lockedHintStyle}>
        {t.collection.unlockHint}
      </small>
    </div>
  )
}

function ProfileView({
  t,
  appLanguage,
  changeAppLanguage,
  user,
  profile,
  ownedCount,
  totalCount,
  collectionRate,
  logout
}) {
  const nickname =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email

  return (
    <section style={contentSectionStyle}>
      <div style={profileCardStyle}>
        <div style={profileAvatarStyle}>
          {String(nickname || '?').slice(0, 1).toUpperCase()}
        </div>

        <h2 style={{ margin: '12px 0 4px' }}>
          {nickname}
        </h2>

        <p style={{ margin: 0, color: '#64748b' }}>
          {t.profile.explorer}
        </p>
      </div>

      <div style={profileStatGridStyle}>
        <div style={profileStatStyle}>
          <strong>{profile?.level ?? 1}</strong>
          <span>{t.profile.level}</span>
        </div>

        <div style={profileStatStyle}>
          <strong>{profile?.exp ?? 0}</strong>
          <span>{t.profile.exp}</span>
        </div>

        <div style={profileStatStyle}>
          <strong>{ownedCount}/{totalCount}</strong>
          <span>{t.profile.quest}</span>
        </div>

        <div style={profileStatStyle}>
          <strong>{collectionRate}%</strong>
          <span>{t.profile.completion}</span>
        </div>
      </div>

      <div style={settingsBoxStyle}>
        <div style={settingRowStyle}>
          <div>
            <strong>{t.profile.appLanguage}</strong>
            <p style={settingDescStyle}>
              {appLanguage === 'ko' ? '한국어' : 'English'}
            </p>
          </div>

          <button onClick={changeAppLanguage} style={smallButtonStyle}>
            🌐 {appLanguage === 'ko' ? 'EN' : 'KO'}
          </button>
        </div>

        <div style={settingRowStyle}>
          <div>
            <strong>{t.profile.studyLanguage}</strong>
            <p style={settingDescStyle}>
              {t.profile.studyLanguageValue}
            </p>
          </div>

          <span style={comingSoonBadgeStyle}>
            MVP
          </span>
        </div>
      </div>

      <div style={noteBoxStyle}>
        <strong>{t.profile.expansionTitle}</strong>
        <p>
          {t.profile.expansionText}
        </p>
      </div>

      <button onClick={logout} style={logoutButtonStyle}>
        {t.profile.logout}
      </button>
    </section>
  )
}

function getCardIcon(category) {
  if (category === '인물') return '👑'
  if (category === '유물') return '🏺'
  if (category === '전쟁') return '⚔️'
  if (category === '건축') return '🏯'
  if (category === '예술') return '🎨'
  if (category === '복식') return '🥻'
  if (category === '제도') return '📜'
  if (category === '사상') return '🪷'
  return '✨'
}

function getLockedLabel(node) {
  if (node.category === '인물') return '??? 왕'
  if (node.category === '전쟁') return '??? 전투'
  if (node.category === '유물') return '??? 유물'
  if (node.category === '건축') return '??? 건축'
  if (node.category === '예술') return '??? 예술'
  if (node.category === '복식') return '??? 복식'
  if (node.category === '제도') return '??? 제도'
  return '????'
}

function getRoadmapNodeStyle(node, owned) {
  if (!owned) {
    return {
      background: '#4b5563',
      borderColor: '#6b7280',
      color: '#e5e7eb'
    }
  }

  if (node.category === '인물') {
    return {
      background: '#a21caf',
      borderColor: '#581c87',
      color: 'white'
    }
  }

  if (node.category === '전쟁') {
    return {
      background: '#dc2626',
      borderColor: '#7f1d1d',
      color: 'white'
    }
  }

  if (node.category === '건축' || node.category === '복식') {
    return {
      background: '#c2410c',
      borderColor: '#7c2d12',
      color: 'white'
    }
  }

  if (node.category === '예술' || node.category === '사상') {
    return {
      background: '#166534',
      borderColor: '#052e16',
      color: 'white'
    }
  }

  if (node.category === '유물' || node.category === '제도') {
    return {
      background: '#475569',
      borderColor: '#1e293b',
      color: 'white'
    }
  }

  return {
    background: '#4338ca',
    borderColor: '#312e81',
    color: 'white'
  }
}

function getRarityStyle(rarity) {
  if (rarity === 'SSR') {
    return {
      border: '#f59e0b',
      cardBackground: 'linear-gradient(180deg, #fffbeb, #ffffff)',
      badge: {
        background: 'linear-gradient(135deg, #f59e0b, #fde047)',
        color: '#78350f'
      }
    }
  }

  if (rarity === 'SR') {
    return {
      border: '#8b5cf6',
      cardBackground: 'linear-gradient(180deg, #f5f3ff, #ffffff)',
      badge: {
        background: 'linear-gradient(135deg, #7c3aed, #c4b5fd)',
        color: 'white'
      }
    }
  }

  if (rarity === 'R') {
    return {
      border: '#3b82f6',
      cardBackground: 'linear-gradient(180deg, #eff6ff, #ffffff)',
      badge: {
        background: 'linear-gradient(135deg, #2563eb, #93c5fd)',
        color: 'white'
      }
    }
  }

  return {
    border: '#cbd5e1',
    cardBackground: 'linear-gradient(180deg, #ffffff, #f8fafc)',
    badge: {
      background: '#e5e7eb',
      color: '#374151'
    }
  }
}

const pageStyle = {
  minHeight: '100vh',
  background: '#e5e7eb',
  margin: 0,
  padding: 0,
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
}

const phoneShellStyle = {
  width: '100%',
  maxWidth: '430px',
  minHeight: '100vh',
  margin: '0 auto',
  background: '#f8fafc',
  padding: '18px 16px 96px',
  boxSizing: 'border-box'
}

const heroStyle = {
  borderRadius: '28px',
  padding: '22px',
  background: 'linear-gradient(135deg, #111827, #312e81 58%, #7c2d12)',
  color: 'white',
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.25)',
  marginBottom: '20px'
}

const heroTopStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px'
}

const eyebrowStyle = {
  margin: '0 0 4px',
  color: '#c7d2fe',
  fontSize: '13px',
  fontWeight: 700
}

const titleStyle = {
  margin: 0,
  fontSize: '36px',
  letterSpacing: '-1px'
}

const heroTextStyle = {
  margin: '12px 0 18px',
  color: '#e5e7eb',
  lineHeight: 1.5
}

const languageButtonStyle = {
  border: 0,
  borderRadius: '999px',
  padding: '8px 10px',
  background: 'rgba(255,255,255,0.14)',
  color: 'white',
  fontWeight: 900,
  fontSize: '12px',
  cursor: 'pointer'
}

const levelBadgeStyle = {
  padding: '8px 11px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.14)',
  fontWeight: 800,
  fontSize: '13px'
}

const progressHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  marginBottom: '8px'
}

const progressTrackStyle = {
  height: '13px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.24)',
  overflow: 'hidden'
}

const progressFillStyle = {
  height: '100%',
  borderRadius: '999px',
  background: 'linear-gradient(90deg, #22c55e, #fde047)',
  transition: 'width 0.35s ease'
}

const miniStatRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '8px',
  marginTop: '16px'
}

const miniStatStyle = {
  padding: '11px',
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.12)',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  textAlign: 'center'
}

const contentSectionStyle = {
  marginTop: '18px'
}

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
}

const eyebrowDarkStyle = {
  margin: '0 0 4px',
  color: '#6366f1',
  fontSize: '13px',
  fontWeight: 800
}

const sectionTitleStyle = {
  margin: 0,
  fontSize: '25px',
  letterSpacing: '-0.4px'
}

const pillStyle = {
  padding: '7px 10px',
  borderRadius: '999px',
  background: '#eef2ff',
  color: '#3730a3',
  fontWeight: 800,
  fontSize: '13px'
}

const questHintStyle = {
  padding: '14px',
  borderRadius: '18px',
  background: '#eef2ff',
  color: '#312e81',
  marginBottom: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontSize: '14px'
}

const quizCardStyle = {
  padding: '18px',
  borderRadius: '24px',
  background: 'white',
  border: '1px solid #e5e7eb',
  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)'
}

const quizLabelStyle = {
  margin: 0,
  color: '#64748b',
  fontSize: '13px',
  fontWeight: 800
}

const questionStyle = {
  margin: '8px 0 16px',
  fontSize: '20px',
  lineHeight: 1.5
}

const choiceGridStyle = {
  display: 'grid',
  gap: '10px'
}

const choiceButtonStyle = {
  width: '100%',
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  padding: '14px',
  borderRadius: '16px',
  border: '1px solid #d1d5db',
  background: '#fff',
  fontSize: '15px',
  textAlign: 'left',
  cursor: 'pointer'
}

const resultBoxStyle = {
  marginTop: '16px',
  padding: '15px',
  borderRadius: '18px',
  border: '1px solid'
}

const explanationStyle = {
  margin: '10px 0 0',
  padding: '12px',
  borderRadius: '14px',
  background: 'rgba(255,255,255,0.75)',
  color: '#334155',
  lineHeight: 1.45,
  fontSize: '13px'
}

const rewardCardStyle = {
  marginTop: '14px',
  padding: '16px',
  borderRadius: '24px',
  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
  border: '2px solid #f59e0b',
  textAlign: 'center',
  boxShadow: '0 10px 24px rgba(245, 158, 11, 0.24)'
}

const rewardTopRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
}

const rewardLabelStyle = {
  color: '#92400e',
  fontSize: '12px',
  fontWeight: 900
}

const rewardFlavorStyle = {
  margin: '10px 0 0',
  color: '#78350f',
  fontSize: '13px',
  lineHeight: 1.45
}

const primaryButtonStyle = {
  width: '100%',
  border: 0,
  borderRadius: '16px',
  padding: '14px 16px',
  background: 'white',
  color: '#111827',
  fontWeight: 900,
  fontSize: '15px',
  cursor: 'pointer'
}

const primaryButtonDarkStyle = {
  width: '100%',
  border: 0,
  borderRadius: '16px',
  padding: '14px 16px',
  background: '#111827',
  color: 'white',
  fontWeight: 900,
  fontSize: '15px',
  cursor: 'pointer',
  marginTop: '14px'
}

const roadmapSummaryStyle = {
  padding: '15px',
  borderRadius: '20px',
  background: '#111827',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  marginBottom: '12px',
  lineHeight: 1.45
}

const progressTrackLightStyle = {
  height: '10px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.18)',
  overflow: 'hidden',
  marginTop: '6px'
}

const progressFillLightStyle = {
  height: '100%',
  borderRadius: '999px',
  background: 'linear-gradient(90deg, #22c55e, #fde047)'
}

const roadmapLegendStyle = {
  display: 'flex',
  gap: '6px',
  overflowX: 'auto',
  paddingBottom: '10px',
  marginBottom: '8px'
}

const legendPillStyle = {
  flex: '0 0 auto',
  padding: '6px 9px',
  borderRadius: '999px',
  background: '#eef2ff',
  color: '#3730a3',
  fontSize: '12px',
  fontWeight: 900
}

const roadmapScrollStyle = {
  overflowX: 'auto',
  background: '#020617',
  borderRadius: '24px',
  padding: '14px',
  boxShadow: '0 10px 26px rgba(15, 23, 42, 0.18)'
}

const roadmapCanvasStyle = {
  position: 'relative',
  background: '#020617',
  borderRadius: '18px',
  overflow: 'hidden'
}

const roadmapVerticalLineStyle = {
  position: 'absolute',
  top: 20,
  bottom: 20,
  width: '3px',
  background: '#f97316',
  opacity: 0.9
}

const roadmapHorizontalLineStyle = {
  position: 'absolute',
  left: 34,
  right: 34,
  height: '3px',
  background: '#f97316',
  opacity: 0.85
}

const roadmapNodeStyle = {
  position: 'absolute',
  width: '80px',
  minHeight: '54px',
  borderRadius: '16px',
  border: '3px solid',
  padding: '7px 6px',
  zIndex: 3,
  fontSize: '11px',
  fontWeight: 900,
  lineHeight: 1.25,
  textAlign: 'center',
  cursor: 'pointer',
  boxShadow: '0 8px 18px rgba(0,0,0,0.38)'
}

const roadmapNodeYearStyle = {
  display: 'block',
  fontSize: '9px',
  opacity: 0.85,
  marginBottom: '3px'
}

const selectedNodeBoxStyle = {
  marginTop: '14px',
  padding: '16px',
  borderRadius: '20px',
  background: 'white',
  border: '1px solid #e5e7eb',
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)'
}

const nodeDetailTopStyle = {
  display: 'flex',
  gap: '7px',
  flexWrap: 'wrap'
}

const unlockedBadgeStyle = {
  padding: '5px 8px',
  borderRadius: '999px',
  background: '#dcfce7',
  color: '#166534',
  fontSize: '12px',
  fontWeight: 900
}

const lockedBadgeStyle = {
  padding: '5px 8px',
  borderRadius: '999px',
  background: '#e5e7eb',
  color: '#374151',
  fontSize: '12px',
  fontWeight: 900
}

const nodeGroupBadgeStyle = {
  padding: '5px 8px',
  borderRadius: '999px',
  background: '#eef2ff',
  color: '#3730a3',
  fontSize: '12px',
  fontWeight: 900
}

const collectionSummaryStyle = {
  padding: '15px',
  borderRadius: '20px',
  background: '#eef2ff',
  color: '#312e81',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '20px'
}

const subTitleStyle = {
  margin: '22px 0 10px',
  fontSize: '18px'
}

const cardGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '12px'
}

const ownedCardStyle = {
  padding: '12px',
  borderRadius: '22px',
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.07)'
}

const cardTopRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '6px',
  marginBottom: '8px'
}

const rarityBadgeStyle = {
  padding: '4px 8px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 900
}

const countBadgeStyle = {
  padding: '4px 8px',
  borderRadius: '999px',
  background: '#fef3c7',
  color: '#92400e',
  fontSize: '11px',
  fontWeight: 900
}

const cardImageWrapStyle = {
  width: '100%',
  borderRadius: '18px',
  overflow: 'hidden',
  background: '#f1f5f9',
  marginBottom: '10px'
}

const cardImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
}

const cardImagePlaceholderStyle = {
  width: '100%',
  borderRadius: '18px',
  background: 'linear-gradient(135deg, #fef3c7, #e0e7ff)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '10px'
}

const ownedCardTitleStyle = {
  margin: '0 0 5px',
  fontSize: '16px',
  lineHeight: 1.3
}

const cardMetaStyle = {
  margin: 0,
  color: '#64748b',
  fontSize: '13px'
}

const flavorTextStyle = {
  margin: '9px 0 0',
  color: '#475569',
  fontSize: '12px',
  lineHeight: 1.45
}

const lockedCardStyle = {
  minHeight: '188px',
  borderRadius: '22px',
  padding: '15px',
  background: 'linear-gradient(135deg, #111827, #374151)',
  color: 'white',
  border: '1px solid #4b5563',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.35)'
}

const lockedGlowStyle = {
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(circle at center, rgba(255,255,255,0.17), transparent 58%)'
}

const lockedIconStyle = {
  position: 'relative',
  zIndex: 1,
  width: '54px',
  height: '54px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '30px',
  marginBottom: '12px'
}

const lockedTitleStyle = {
  position: 'relative',
  zIndex: 1,
  margin: '0 0 8px',
  fontSize: '20px',
  letterSpacing: '2px'
}

const lockedTextStyle = {
  position: 'relative',
  zIndex: 1,
  margin: 0,
  color: '#d1d5db',
  fontSize: '13px',
  lineHeight: 1.45
}

const lockedHintStyle = {
  position: 'relative',
  zIndex: 1,
  display: 'block',
  marginTop: '12px',
  color: '#c7d2fe',
  fontWeight: 800
}

const bottomNavStyle = {
  position: 'fixed',
  left: '50%',
  bottom: '14px',
  transform: 'translateX(-50%)',
  width: 'calc(100% - 28px)',
  maxWidth: '398px',
  padding: '8px',
  borderRadius: '24px',
  background: 'rgba(17, 24, 39, 0.94)',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '5px',
  boxShadow: '0 16px 36px rgba(15, 23, 42, 0.38)',
  zIndex: 20
}

const tabButtonStyle = (active) => ({
  border: 0,
  borderRadius: '18px',
  padding: '9px 4px',
  background: active ? 'white' : 'transparent',
  color: active ? '#111827' : '#d1d5db',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
  fontWeight: 900,
  cursor: 'pointer',
  fontSize: '12px'
})

const profileCardStyle = {
  padding: '24px',
  borderRadius: '28px',
  background: 'white',
  border: '1px solid #e5e7eb',
  textAlign: 'center',
  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)'
}

const profileAvatarStyle = {
  width: '72px',
  height: '72px',
  margin: '0 auto',
  borderRadius: '24px',
  background: 'linear-gradient(135deg, #312e81, #7c2d12)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  fontWeight: 900
}

const profileStatGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
  marginTop: '16px'
}

const profileStatStyle = {
  padding: '16px',
  borderRadius: '20px',
  background: 'white',
  border: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  textAlign: 'center'
}

const settingsBoxStyle = {
  marginTop: '16px',
  padding: '16px',
  borderRadius: '22px',
  background: 'white',
  border: '1px solid #e5e7eb',
  display: 'grid',
  gap: '12px'
}

const settingRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px'
}

const settingDescStyle = {
  margin: '4px 0 0',
  color: '#64748b',
  fontSize: '13px'
}

const smallButtonStyle = {
  border: 0,
  borderRadius: '999px',
  padding: '8px 12px',
  background: '#111827',
  color: 'white',
  fontWeight: 900,
  cursor: 'pointer'
}

const comingSoonBadgeStyle = {
  padding: '6px 10px',
  borderRadius: '999px',
  background: '#fef3c7',
  color: '#92400e',
  fontSize: '12px',
  fontWeight: 900
}

const noteBoxStyle = {
  marginTop: '16px',
  padding: '16px',
  borderRadius: '20px',
  background: '#fef3c7',
  color: '#78350f',
  lineHeight: 1.5
}

const logoutButtonStyle = {
  width: '100%',
  marginTop: '16px',
  padding: '14px',
  borderRadius: '16px',
  border: '1px solid #d1d5db',
  background: 'white',
  fontWeight: 900,
  cursor: 'pointer'
}

const emptyBoxStyle = {
  padding: '18px',
  borderRadius: '18px',
  background: 'white',
  border: '1px dashed #cbd5e1',
  color: '#64748b'
}

const completeBoxStyle = {
  padding: '18px',
  borderRadius: '18px',
  background: '#ecfdf5',
  border: '1px solid #86efac',
  color: '#166534',
  fontWeight: 900
}

const errorBoxStyle = {
  padding: '14px',
  borderRadius: '16px',
  background: '#fff1f2',
  border: '1px solid #fecdd3',
  color: '#be123c',
  marginBottom: '14px'
}
