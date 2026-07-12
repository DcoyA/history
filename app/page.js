'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const UI = {
  ko: {
    appTitle: 'Hi-Story',
    subtitle: '역사로 언어를 배우는 카드 수집 RPG',
    start: 'Google로 시작하기',
    progress: '고구려 진행도',
    completed: '완료',
    remaining: '남은 퀘스트',
    total: '전체',
    tabs: {
      quiz: '퀘스트',
      roadmap: '로드맵',
      collection: '도감',
      profile: '내정보'
    },
    quiz: {
      eyebrow: '오늘의 역사 영어',
      title: '고구려 퀘스트',
      hint: '역사 퀴즈를 풀면 카드와 학습 표현이 해금됩니다.',
      question: '역사 퀴즈',
      correct: '정답입니다!',
      wrong: '오답입니다',
      tryAgain: '다시 골라보세요.',
      next: '다음 퀘스트',
      reward: '획득 카드',
      newCard: '새 카드 획득',
      countUp: '카드 수량 증가',
      rewardError: '보상 카드 정보를 불러오지 못했습니다.',
      saveError: '카드 저장 중 오류가 발생했습니다.',
      noQuiz: '등록된 퀴즈가 없습니다.'
    },
    roadmap: {
      eyebrow: '학습 여정',
      title: '고구려 로드맵',
      desc: '퀴즈를 풀수록 역사 노드가 해금됩니다.',
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
      complete: '고구려 도감을 모두 완성했습니다!',
      undiscovered: '미발견 카드',
      unlockHint: '퀴즈를 풀어 해금'
    },
    profile: {
      title: '내정보',
      explorer: '고구려 로드맵 탐험가',
      level: '레벨',
      exp: '경험치',
      quest: '퀘스트',
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
    progress: 'Goguryeo Progress',
    completed: 'Done',
    remaining: 'Quests Left',
    total: 'Total',
    tabs: {
      quiz: 'Quest',
      roadmap: 'Roadmap',
      collection: 'Cards',
      profile: 'Profile'
    },
    quiz: {
      eyebrow: "Today's History English",
      title: 'Goguryeo Quest',
      hint: 'Answer history quizzes to unlock cards and language expressions.',
      question: 'History Quiz',
      correct: 'Correct!',
      wrong: 'Not quite',
      tryAgain: 'Try again.',
      next: 'Next Quest',
      reward: 'Reward Card',
      newCard: 'New Card Unlocked',
      countUp: 'Card Count Increased',
      rewardError: 'Could not load the reward card.',
      saveError: 'There was an error saving the card.',
      noQuiz: 'No quiz has been added yet.'
    },
    roadmap: {
      eyebrow: 'Learning Journey',
      title: 'Goguryeo Roadmap',
      desc: 'Historical nodes unlock as you answer quizzes.',
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
      complete: 'You completed the Goguryeo collection!',
      undiscovered: 'Undiscovered Card',
      unlockHint: 'Unlock through quizzes'
    },
    profile: {
      title: 'Profile',
      explorer: 'Goguryeo Roadmap Explorer',
      level: 'Level',
      exp: 'EXP',
      quest: 'Quests',
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

function pick(value, fallback) {
  return value || fallback || ''
}

function cardName(card, lang) {
  if (!card) return ''
  return lang === 'en' ? pick(card.name_en, card.name) : card.name
}

function cardEra(card, lang) {
  if (!card) return ''
  return lang === 'en' ? pick(card.era_en, card.era) : card.era
}

function cardCategory(card, lang) {
  if (!card) return ''
  return lang === 'en' ? pick(card.category_en, card.category) : card.category
}

function cardFlavor(card, lang) {
  if (!card) return ''
  return lang === 'en' ? pick(card.flavor_text_en, card.flavor_text) : card.flavor_text
}

function lessonQuestion(lesson, lang) {
  if (!lesson) return ''
  return lang === 'en' ? pick(lesson.question_en, lesson.question) : lesson.question
}

function lessonChoice(lesson, number, lang) {
  if (!lesson) return ''
  const ko = lesson[`choice${number}`]
  const en = lesson[`choice${number}_en`]
  return lang === 'en' ? pick(en, ko) : ko
}

function lessonExplanation(lesson, lang) {
  if (!lesson) return ''
  return lang === 'en' ? pick(lesson.explanation_en, lesson.explanation) : lesson.explanation
}

function nodeLabel(node, lang) {
  if (!node) return ''
  return lang === 'en' ? pick(node.label_en, node.label) : node.label
}

function nodeCategory(node, lang) {
  if (!node) return ''
  return lang === 'en' ? pick(node.category_en, node.category) : node.category
}

function nodeGroup(node, lang) {
  if (!node) return ''
  return lang === 'en' ? pick(node.roadmap_group_en, node.roadmap_group) : node.roadmap_group
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

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [resultMessage, setResultMessage] = useState('')
  const [rewardMessage, setRewardMessage] = useState('')
  const [lastRewardCard, setLastRewardCard] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  const [activeTab, setActiveTab] = useState('quiz')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

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

    if (savedProfile) {
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

    const isCorrect = Number(choiceNumber) === Number(currentLesson.answer)

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
      console.error(rewardCardError)
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
      console.error(existingError)
      setResultMessage(t.quiz.correct)
      setRewardMessage(t.quiz.saveError)
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
        console.error(updateError)
        setResultMessage(t.quiz.correct)
        setRewardMessage(t.quiz.saveError)
        return
      }

      setResultMessage(t.quiz.correct)
      setRewardMessage(`${cardName(rewardCard, appLanguage)} ${t.quiz.countUp} x${nextCount}`)
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
        console.error(insertError)
        setResultMessage(t.quiz.correct)
        setRewardMessage(t.quiz.saveError)
        return
      }

      setResultMessage(t.quiz.correct)
      setRewardMessage(`${t.quiz.newCard}: ${cardName(rewardCard, appLanguage)}`)
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
      <main style={styles.page}>
        <div style={styles.shell}>
          <h1>{t.appTitle}</h1>
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
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.hero}>
          <div style={styles.heroTop}>
            <div>
              <p style={styles.heroEyebrow}>LANGUAGE THROUGH HISTORY</p>
              <h1 style={styles.title}>{t.appTitle}</h1>
            </div>

            <div style={styles.heroButtons}>
              <button onClick={changeAppLanguage} style={styles.langButton}>
                🌐 {appLanguage.toUpperCase()}
              </button>

              {user && (
                <div style={styles.levelBadge}>
                  Lv. {profile?.level ?? 1}
                </div>
              )}
            </div>
          </div>

          <p style={styles.heroText}>
            {t.subtitle}
          </p>

          {!user ? (
            <button onClick={login} style={styles.goldButton}>
              {t.start}
            </button>
          ) : (
            <>
              <div style={styles.progressHeader}>
                <span>{t.progress}</span>
                <strong>{collectionRate}%</strong>
              </div>

              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${collectionRate}%`
                  }}
                />
              </div>

              <div style={styles.statRow}>
                <div style={styles.statBox}>
                  <strong>{ownedCount}</strong>
                  <span>{t.completed}</span>
                </div>

                <div style={styles.statBox}>
                  <strong>{lockedCards.length}</strong>
                  <span>{t.remaining}</span>
                </div>

                <div style={styles.statBox}>
                  <strong>{totalCount}</strong>
                  <span>{t.total}</span>
                </div>
              </div>
            </>
          )}
        </section>

        {errorMessage && (
          <div style={styles.errorBox}>
            {errorMessage}
          </div>
        )}

        {user && activeTab === 'quiz' && (
          <QuizTab
            t={t}
            appLanguage={appLanguage}
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
          <RoadmapTab
            t={t}
            appLanguage={appLanguage}
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
          <CollectionTab
            t={t}
            appLanguage={appLanguage}
            ownedCards={ownedCards}
            lockedCards={lockedCards}
            ownedCount={ownedCount}
            totalCount={totalCount}
            collectionRate={collectionRate}
          />
        )}

        {user && activeTab === 'profile' && (
          <ProfileTab
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
          <nav style={styles.bottomNav}>
            <button onClick={() => setActiveTab('quiz')} style={tabStyle(activeTab === 'quiz')}>
              <span>⚔️</span>
              <small>{t.tabs.quiz}</small>
            </button>

            <button onClick={() => setActiveTab('roadmap')} style={tabStyle(activeTab === 'roadmap')}>
              <span>🗺️</span>
              <small>{t.tabs.roadmap}</small>
            </button>

            <button onClick={() => setActiveTab('collection')} style={tabStyle(activeTab === 'collection')}>
              <span>📚</span>
              <small>{t.tabs.collection}</small>
            </button>

            <button onClick={() => setActiveTab('profile')} style={tabStyle(activeTab === 'profile')}>
              <span>👤</span>
              <small>{t.tabs.profile}</small>
            </button>
          </nav>
        )}
      </div>
    </main>
  )
}

function QuizTab({
  t,
  appLanguage,
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
      <section style={styles.section}>
        <h2>{t.quiz.title}</h2>
        <p>{t.quiz.noQuiz}</p>
      </section>
    )
  }

  const answeredCorrectly = resultMessage === t.quiz.correct

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.goldEyebrow}>{t.quiz.eyebrow}</p>
          <h2 style={styles.sectionTitle}>{t.quiz.title}</h2>
        </div>

        <span style={styles.pill}>
          {currentLessonIndex + 1} / {lessons.length}
        </span>
      </div>

      <div style={styles.languageBox}>
        <strong>History Phrase</strong>
        <p>{lessonQuestion(currentLesson, 'en') || lessonQuestion(currentLesson, appLanguage)}</p>
      </div>

      <div style={styles.hintBox}>
        {t.quiz.hint}
      </div>

      <div style={styles.quizCard}>
        <p style={styles.quizLabel}>{t.quiz.question}</p>
        <h3 style={styles.question}>
          {lessonQuestion(currentLesson, appLanguage)}
        </h3>

        <div style={styles.choiceGrid}>
          {[1, 2, 3, 4].map((number) => {
            const isSelected = selectedChoice === number
            const isCorrectChoice = Number(number) === Number(currentLesson.answer)

            let buttonStyle = styles.choiceButton

            if (isSelected) {
              buttonStyle = {
                ...buttonStyle,
                border: '1px solid #d6b35a',
                background: '#1e293b'
              }
            }

            if (answeredCorrectly && isCorrectChoice) {
              buttonStyle = {
                ...buttonStyle,
                border: '1px solid #22c55e',
                background: '#064e3b'
              }
            }

            return (
              <button
                key={number}
                onClick={() => handleAnswer(number)}
                disabled={answeredCorrectly}
                style={buttonStyle}
              >
                <b>{number}</b>
                <span>{lessonChoice(currentLesson, number, appLanguage)}</span>
              </button>
            )
          })}
        </div>

        {resultMessage && (
          <div
            style={{
              ...styles.resultBox,
              borderColor: answeredCorrectly ? '#22c55e' : '#ef4444'
            }}
          >
            <strong style={{ color: answeredCorrectly ? '#86efac' : '#fecaca' }}>
              {resultMessage}
            </strong>

            {rewardMessage && (
              <p style={{ margin: '6px 0 0' }}>
                {rewardMessage}
              </p>
            )}

            {answeredCorrectly && lessonExplanation(currentLesson, appLanguage) && (
              <p style={styles.explanation}>
                {lessonExplanation(currentLesson, appLanguage)}
              </p>
            )}

            {lastRewardCard && (
              <RewardCard
                t={t}
                appLanguage={appLanguage}
                card={lastRewardCard}
              />
            )}
          </div>
        )}

        {answeredCorrectly && (
          <button onClick={goNextQuiz} style={styles.goldButton}>
            {t.quiz.next}
          </button>
        )}
      </div>
    </section>
  )
}

function RoadmapTab({
  t,
  appLanguage,
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
        label_en: card.name_en,
        category: card.category,
        category_en: card.category_en,
        roadmap_group: card.roadmap_group,
        roadmap_group_en: card.roadmap_group_en,
        year_start: card.year_start,
        x_column: (index % 4) + 1,
        y_order: Math.floor(index / 4) + 1
      }))

  const maxY = Math.max(...nodes.map((node) => Number(node.y_order || 1)), 1)
  const mapHeight = maxY * 92 + 110
  const mapWidth = 392

  const groups = appLanguage === 'en'
    ? ['State Building', 'Golden Age', 'Southern Expansion', 'Sui-Tang Wars', 'Daily Life']
    : ['국가 정비', '전성기 확장', '남진과 전성기', '수·당 전쟁', '생활 문화']

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.goldEyebrow}>{t.roadmap.eyebrow}</p>
          <h2 style={styles.sectionTitle}>{t.roadmap.title}</h2>
        </div>

        <span style={styles.pill}>
          {ownedCount}/{totalCount}
        </span>
      </div>

      <div style={styles.roadmapSummary}>
        <strong>{t.roadmap.desc}</strong>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${collectionRate}%`
            }}
          />
        </div>
      </div>

      <div style={styles.legendRow}>
        {groups.map((group) => (
          <span key={group} style={styles.legendPill}>
            {group}
          </span>
        ))}
      </div>

      <div style={styles.roadmapScroll}>
        <div
          style={{
            ...styles.roadmapCanvas,
            width: mapWidth,
            height: mapHeight
          }}
        >
          {[1, 2, 3, 4].map((column) => (
            <div
              key={column}
              style={{
                ...styles.roadmapVerticalLine,
                left: `${(column - 1) * 92 + 48}px`
              }}
            />
          ))}

          {[3, 5, 8, 11].map((row) => (
            <div
              key={row}
              style={{
                ...styles.roadmapHorizontalLine,
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
                  ...styles.roadmapNode,
                  ...getRoadmapNodeStyle(node, owned),
                  left,
                  top
                }}
              >
                <span style={styles.roadmapYear}>
                  {node.year_start || ''}
                </span>
                <strong>
                  {owned ? nodeLabel(node, appLanguage) : getLockedLabel(node, appLanguage)}
                </strong>
              </button>
            )
          })}
        </div>
      </div>

      <div style={styles.nodeDetail}>
        {selectedNode ? (
          <RoadmapNodeDetail
            t={t}
            appLanguage={appLanguage}
            node={selectedNode}
            owned={ownedCardIds.includes(selectedNode.card_id)}
            card={allCards.find((card) => card.id === selectedNode.card_id)}
          />
        ) : (
          <>
            <strong>{t.roadmap.tap}</strong>
            <p style={{ color: '#94a3b8' }}>{t.roadmap.desc}</p>
          </>
        )}
      </div>
    </section>
  )
}

function RoadmapNodeDetail({ t, appLanguage, node, owned, card }) {
  return (
    <div>
      <div style={styles.badgeRow}>
        <span style={owned ? styles.unlockedBadge : styles.lockedBadge}>
          {owned ? t.roadmap.unlocked : t.roadmap.locked}
        </span>

        <span style={styles.groupBadge}>
          {nodeGroup(node, appLanguage) || 'Goguryeo'}
        </span>
      </div>

      <h3 style={{ margin: '10px 0 6px' }}>
        {owned ? nodeLabel(node, appLanguage) : t.roadmap.lockedQuest}
      </h3>

      <p style={{ margin: '0 0 8px', color: '#94a3b8', lineHeight: 1.45 }}>
        {owned
          ? cardFlavor(card, appLanguage)
          : `${nodeCategory(node, appLanguage)} · ${t.collection.unlockHint}`}
      </p>
    </div>
  )
}

function CollectionTab({
  t,
  appLanguage,
  ownedCards,
  lockedCards,
  ownedCount,
  totalCount,
  collectionRate
}) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.goldEyebrow}>{t.collection.eyebrow}</p>
          <h2 style={styles.sectionTitle}>{t.collection.title}</h2>
        </div>

        <span style={styles.pill}>
          {collectionRate}%
        </span>
      </div>

      <div style={styles.collectionSummary}>
        <strong>{ownedCount} / {totalCount}</strong>
        <span>{t.collection.locked}: {lockedCards.length}</span>
      </div>

      <h3 style={styles.subTitle}>{t.collection.owned}</h3>

      {ownedCards.length === 0 ? (
        <div style={styles.emptyBox}>
          {t.collection.empty}
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {ownedCards.map((item) => (
            <OwnedCard
              key={item.id}
              item={item}
              appLanguage={appLanguage}
            />
          ))}
        </div>
      )}

      <h3 style={styles.subTitle}>{t.collection.locked}</h3>

      {lockedCards.length === 0 ? (
        <div style={styles.completeBox}>
          {t.collection.complete}
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {lockedCards.map((card) => (
            <LockedCard
              key={card.id}
              t={t}
              appLanguage={appLanguage}
              card={card}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function OwnedCard({ item, appLanguage }) {
  const card = item.card
  const rarityStyle = getRarityStyle(card?.rarity)

  return (
    <div
      style={{
        ...styles.ownedCard,
        border: `1px solid ${rarityStyle.border}`,
        background: rarityStyle.cardBackground
      }}
    >
      <div style={styles.cardTopRow}>
        <span style={{ ...styles.rarityBadge, ...rarityStyle.badge }}>
          {card?.rarity || 'N'}
        </span>

        <span style={styles.countBadge}>
          x{item.count || 1}
        </span>
      </div>

      <CardImage card={card} size="normal" appLanguage={appLanguage} />

      <h3 style={styles.cardTitle}>
        {cardName(card, appLanguage)}
      </h3>

      <p style={styles.cardMeta}>
        {cardEra(card, appLanguage)} · {cardCategory(card, appLanguage)}
      </p>

      {cardFlavor(card, appLanguage) && (
        <p style={styles.flavorText}>
          {cardFlavor(card, appLanguage)}
        </p>
      )}
    </div>
  )
}

function RewardCard({ t, appLanguage, card }) {
  const rarityStyle = getRarityStyle(card?.rarity)

  return (
    <div style={styles.rewardCard}>
      <div style={styles.rewardTopRow}>
        <span style={{ ...styles.rarityBadge, ...rarityStyle.badge }}>
          {card?.rarity || 'N'}
        </span>

        <span style={styles.rewardLabel}>{t.quiz.reward}</span>
      </div>

      <CardImage card={card} size="large" appLanguage={appLanguage} />

      <h3 style={{ margin: '10px 0 4px', fontSize: 22 }}>
        {cardName(card, appLanguage)}
      </h3>

      <p style={{ margin: '0 0 8px', color: '#d6b35a', fontSize: 13 }}>
        {cardEra(card, appLanguage)} · {cardCategory(card, appLanguage)}
      </p>

      {cardFlavor(card, appLanguage) && (
        <p style={styles.rewardFlavor}>
          {cardFlavor(card, appLanguage)}
        </p>
      )}
    </div>
  )
}

function CardImage({ card, size, appLanguage }) {
  const isLarge = size === 'large'
  const height = isLarge ? 
