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

    if (!profileError && savedProfile) {
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
  const height = isLarge ? 158 : 112
  const fontSize = isLarge ? 52 : 42
  const altText = cardName(card, appLanguage) || 'card image'

  if (card?.image_url) {
    return (
      <div
        style={{
          ...styles.cardImageWrap,
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
        ...styles.cardImagePlaceholder,
        height,
        fontSize
      }}
    >
      {getCardIcon(card?.category)}
    </div>
  )
}

function LockedCard({ t, appLanguage, card }) {
  return (
    <div style={styles.lockedCard}>
      <div style={styles.lockedGlow} />

      <div style={styles.lockedIcon}>
        ?
      </div>

      <h3 style={styles.lockedTitle}>
        ?????
      </h3>

      <p style={styles.lockedText}>
        {cardCategory(card, appLanguage) || t.collection.undiscovered}
      </p>

      <small style={styles.lockedHint}>
        {t.collection.unlockHint}
      </small>
    </div>
  )
}

function ProfileTab({
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
    <section style={styles.section}>
      <div style={styles.profileCard}>
        <div style={styles.profileAvatar}>
          {String(nickname || '?').slice(0, 1).toUpperCase()}
        </div>

        <h2 style={{ margin: '12px 0 4px' }}>
          {nickname}
        </h2>

        <p style={{ margin: 0, color: '#94a3b8' }}>
          {t.profile.explorer}
        </p>
      </div>

      <div style={styles.profileStatGrid}>
        <div style={styles.profileStat}>
          <strong>{profile?.level ?? 1}</strong>
          <span>{t.profile.level}</span>
        </div>

        <div style={styles.profileStat}>
          <strong>{profile?.exp ?? 0}</strong>
          <span>{t.profile.exp}</span>
        </div>

        <div style={styles.profileStat}>
          <strong>{ownedCount}/{totalCount}</strong>
          <span>{t.profile.quest}</span>
        </div>

        <div style={styles.profileStat}>
          <strong>{collectionRate}%</strong>
          <span>{t.profile.completion}</span>
        </div>
      </div>

      <div style={styles.settingsBox}>
        <div>
          <strong>{t.profile.appLanguage}</strong>
          <button onClick={changeAppLanguage} style={styles.smallGoldButton}>
            🌐 {appLanguage === 'ko' ? '한국어 → English' : 'English → 한국어'}
          </button>
        </div>

        <div>
          <strong>{t.profile.studyLanguage}</strong>
          <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>
            English
          </p>
        </div>
      </div>

      <button onClick={logout} style={styles.logoutButton}>
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

function getLockedLabel(node, lang) {
  const category = nodeCategory(node, lang)

  if (lang === 'en') {
    if (category === 'Figure') return '??? Figure'
    if (category === 'War') return '??? Battle'
    if (category === 'Artifact') return '??? Artifact'
    if (category === 'Architecture') return '??? Building'
    if (category === 'Art') return '??? Art'
    if (category === 'Clothing') return '??? Clothing'
    if (category === 'Institution') return '??? System'
    return '????'
  }

  if (category === '인물') return '??? 왕'
  if (category === '전쟁') return '??? 전투'
  if (category === '유물') return '??? 유물'
  if (category === '건축') return '??? 건축'
  if (category === '예술') return '??? 예술'
  if (category === '복식') return '??? 복식'
  if (category === '제도') return '??? 제도'
  return '????'
}

function getRoadmapNodeStyle(node, owned) {
  if (!owned) {
    return {
      background: '#334155',
      borderColor: '#64748b',
      color: '#cbd5e1'
    }
  }

  if (node.category === '인물') {
    return {
      background: '#7e22ce',
      borderColor: '#c084fc',
      color: 'white'
    }
  }

  if (node.category === '전쟁') {
    return {
      background: '#b91c1c',
      borderColor: '#f87171',
      color: 'white'
    }
  }

  if (node.category === '건축' || node.category === '복식') {
    return {
      background: '#c2410c',
      borderColor: '#fb923c',
      color: 'white'
    }
  }

  if (node.category === '예술' || node.category === '사상') {
    return {
      background: '#166534',
      borderColor: '#4ade80',
      color: 'white'
    }
  }

  if (node.category === '유물' || node.category === '제도') {
    return {
      background: '#475569',
      borderColor: '#cbd5e1',
      color: 'white'
    }
  }

  return {
    background: '#4338ca',
    borderColor: '#818cf8',
    color: 'white'
  }
}

function getRarityStyle(rarity) {
  if (rarity === 'SSR') {
    return {
      border: '#d6b35a',
      cardBackground: 'linear-gradient(180deg, #2a2115, #111827)',
      badge: {
        background: 'linear-gradient(135deg, #d6b35a, #facc15)',
        color: '#2a1600'
      }
    }
  }

  if (rarity === 'SR') {
    return {
      border: '#8b5cf6',
      cardBackground: 'linear-gradient(180deg, #21183d, #111827)',
      badge: {
        background: 'linear-gradient(135deg, #7c3aed, #c4b5fd)',
        color: 'white'
      }
    }
  }

  if (rarity === 'R') {
    return {
      border: '#3b82f6',
      cardBackground: 'linear-gradient(180deg, #10213f, #111827)',
      badge: {
        background: 'linear-gradient(135deg, #2563eb, #93c5fd)',
        color: 'white'
      }
    }
  }

  return {
    border: '#475569',
    cardBackground: 'linear-gradient(180deg, #1f2937, #111827)',
    badge: {
      background: '#475569',
      color: '#e5e7eb'
    }
  }
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

const styles = {
  page: {
    minHeight: '100vh',
    background: '#020617',
    margin: 0,
    padding: 0,
    color: '#f8fafc',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },

  shell: {
    width: '100%',
    maxWidth: '430px',
    minHeight: '100vh',
    margin: '0 auto',
    background: 'linear-gradient(180deg, #020617, #0f172a 42%, #111827)',
    padding: '18px 16px 96px',
    boxSizing: 'border-box'
  },

  hero: {
    borderRadius: '28px',
    padding: '22px',
    background:
      'radial-gradient(circle at 80% 20%, rgba(214,179,90,0.25), transparent 28%), linear-gradient(135deg, #111827, #1e1b4b 58%, #3b1d0b)',
    color: 'white',
    border: '1px solid rgba(214,179,90,0.28)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
    marginBottom: '20px'
  },

  heroTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px'
  },

  heroButtons: {
    display: 'flex',
    gap: 6,
    alignItems: 'center'
  },

  heroEyebrow: {
    margin: '0 0 4px',
    color: '#d6b35a',
    fontSize: '11px',
    fontWeight: 900,
    letterSpacing: '0.7px'
  },

  title: {
    margin: 0,
    fontSize: '36px',
    letterSpacing: '-1px',
    color: '#f8fafc'
  },

  heroText: {
    margin: '12px 0 18px',
    color: '#cbd5e1',
    lineHeight: 1.5
  },

  langButton: {
    border: '1px solid rgba(214,179,90,0.35)',
    borderRadius: '999px',
    padding: '8px 10px',
    background: 'rgba(15,23,42,0.65)',
    color: 'white',
    fontWeight: 900,
    fontSize: '12px',
    cursor: 'pointer'
  },

  levelBadge: {
    padding: '8px 11px',
    borderRadius: '999px',
    background: 'rgba(214,179,90,0.18)',
    border: '1px solid rgba(214,179,90,0.3)',
    fontWeight: 800,
    fontSize: '13px'
  },

  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '8px'
  },

  progressTrack: {
    height: '12px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.12)',
    overflow: 'hidden'
  },

  progressFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #22c55e, #d6b35a)',
    transition: 'width 0.35s ease'
  },

  statRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginTop: '16px'
  },

  statBox: {
    padding: '11px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    textAlign: 'center'
  },

  section: {
    marginTop: '18px'
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },

  goldEyebrow: {
    margin: '0 0 4px',
    color: '#d6b35a',
    fontSize: '13px',
    fontWeight: 900
  },

  sectionTitle: {
    margin: 0,
    fontSize: '25px',
    letterSpacing: '-0.4px',
    color: '#f8fafc'
  },

  pill: {
    padding: '7px 10px',
    borderRadius: '999px',
    background: 'rgba(214,179,90,0.16)',
    color: '#facc15',
    fontWeight: 800,
    fontSize: '13px',
    border: '1px solid rgba(214,179,90,0.25)'
  },

  languageBox: {
    padding: '15px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))',
    border: '1px solid rgba(214,179,90,0.2)',
    color: '#e2e8f0',
    marginBottom: '12px',
    lineHeight: 1.45
  },

  hintBox: {
    padding: '14px',
    borderRadius: '18px',
    background: 'rgba(59,130,246,0.12)',
    color: '#bfdbfe',
    marginBottom: '12px',
    fontSize: '14px',
    lineHeight: 1.45
  },

  quizCard: {
    padding: '18px',
    borderRadius: '24px',
    background: '#0f172a',
    border: '1px solid rgba(148,163,184,0.22)',
    boxShadow: '0 14px 30px rgba(0,0,0,0.38)'
  },

  quizLabel: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: 800
  },

  question: {
    margin: '8px 0 16px',
    fontSize: '20px',
    lineHeight: 1.5,
    color: '#f8fafc'
  },

  choiceGrid: {
    display: 'grid',
    gap: '10px'
  },

  choiceButton: {
    width: '100%',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '16px',
    border: '1px solid rgba(148,163,184,0.28)',
    background: '#111827',
    color: '#f8fafc',
    fontSize: '15px',
    textAlign: 'left',
    cursor: 'pointer'
  },

  resultBox: {
    marginTop: '16px',
    padding: '15px',
    borderRadius: '18px',
    border: '1px solid',
    background: '#020617',
    color: '#e2e8f0'
  },

  explanation: {
    margin: '10px 0 0',
    padding: '12px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.06)',
    color: '#cbd5e1',
    lineHeight: 1.45,
    fontSize: '13px'
  },

  goldButton: {
    width: '100%',
    border: 0,
    borderRadius: '16px',
    padding: '14px 16px',
    background: 'linear-gradient(135deg, #d6b35a, #b8892f)',
    color: '#1c1204',
    fontWeight: 900,
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '14px'
  },

  roadmapSummary: {
    padding: '15px',
    borderRadius: '20px',
    background: '#0f172a',
    border: '1px solid rgba(214,179,90,0.18)',
    color: '#e2e8f0',
    marginBottom: '12px',
    lineHeight: 1.45
  },

  legendRow: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    paddingBottom: '10px',
    marginBottom: '8px'
  },

  legendPill: {
    flex: '0 0 auto',
    padding: '6px 9px',
    borderRadius: '999px',
    background: 'rgba(214,179,90,0.14)',
    color: '#facc15',
    fontSize: '12px',
    fontWeight: 900
  },

  roadmapScroll: {
    overflowX: 'auto',
    background: '#020617',
    borderRadius: '24px',
    padding: '14px',
    boxShadow: '0 14px 30px rgba(0,0,0,0.4)',
    border: '1px solid rgba(148,163,184,0.18)'
  },

  roadmapCanvas: {
    position: 'relative',
    background: '#020617',
    borderRadius: '18px',
    overflow: 'hidden'
  },

  roadmapVerticalLine: {
    position: 'absolute',
    top: 20,
    bottom: 20,
    width: '3px',
    background: '#f97316',
    opacity: 0.9
  },

  roadmapHorizontalLine: {
    position: 'absolute',
    left: 34,
    right: 34,
    height: '3px',
    background: '#f97316',
    opacity: 0.85
  },

  roadmapNode: {
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
  },

  roadmapYear: {
    display: 'block',
    fontSize: '9px',
    opacity: 0.85,
    marginBottom: '3px'
  },

  nodeDetail: {
    marginTop: '14px',
    padding: '16px',
    borderRadius: '20px',
    background: '#0f172a',
    border: '1px solid rgba(148,163,184,0.2)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.24)'
  },

  badgeRow: {
    display: 'flex',
    gap: '7px',
    flexWrap: 'wrap'
  },

  unlockedBadge: {
    padding: '5px 8px',
    borderRadius: '999px',
    background: 'rgba(34,197,94,0.16)',
    color: '#86efac',
    fontSize: '12px',
    fontWeight: 900
  },

  lockedBadge: {
    padding: '5px 8px',
    borderRadius: '999px',
    background: 'rgba(148,163,184,0.16)',
    color: '#cbd5e1',
    fontSize: '12px',
    fontWeight: 900
  },

  groupBadge: {
    padding: '5px 8px',
    borderRadius: '999px',
    background: 'rgba(214,179,90,0.16)',
    color: '#facc15',
    fontSize: '12px',
    fontWeight: 900
  },

  collectionSummary: {
    padding: '15px',
    borderRadius: '20px',
    background: '#0f172a',
    border: '1px solid rgba(214,179,90,0.18)',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '20px'
  },

  subTitle: {
    margin: '22px 0 10px',
    fontSize: '18px',
    color: '#f8fafc'
  },

  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px'
  },

  ownedCard: {
    padding: '12px',
    borderRadius: '22px',
    boxShadow: '0 12px 24px rgba(0,0,0,0.28)',
    color: '#f8fafc'
  },

  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '6px',
    marginBottom: '8px'
  },

  rarityBadge: {
    padding: '4px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 900
  },

  countBadge: {
    padding: '4px 8px',
    borderRadius: '999px',
    background: 'rgba(214,179,90,0.18)',
    color: '#facc15',
    fontSize: '11px',
    fontWeight: 900
  },

  cardImageWrap: {
    width: '100%',
    borderRadius: '18px',
    overflow: 'hidden',
    background: '#111827',
    marginBottom: '10px'
  },

  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },

  cardImagePlaceholder: {
    width: '100%',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #1e293b, #111827)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px'
  },

  cardTitle: {
    margin: '0 0 5px',
    fontSize: '16px',
    lineHeight: 1.3,
    color: '#f8fafc'
  },

  cardMeta: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '13px'
  },

  flavorText: {
    margin: '9px 0 0',
    color: '#cbd5e1',
    fontSize: '12px',
    lineHeight: 1.45
  },

  rewardCard: {
    marginTop: '14px',
    padding: '16px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #2a2115, #111827)',
    border: '1px solid #d6b35a',
    textAlign: 'center',
    boxShadow: '0 14px 30px rgba(214,179,90,0.18)'
  },

  rewardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },

  rewardLabel: {
    color: '#d6b35a',
    fontSize: '12px',
    fontWeight: 900
  },

  rewardFlavor: {
    margin: '10px 0 0',
    color: '#cbd5e1',
    fontSize: '13px',
    lineHeight: 1.45
  },

  lockedCard: {
    minHeight: '188px',
    borderRadius: '22px',
    padding: '15px',
    background: 'linear-gradient(135deg, #111827, #1e293b)',
    color: 'white',
    border: '1px solid #334155',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.35)'
  },

  lockedGlow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, rgba(214,179,90,0.16), transparent 58%)'
  },

  lockedIcon: {
    position: 'relative',
    zIndex: 1,
    width: '54px',
    height: '54px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    marginBottom: '12px'
  },

  lockedTitle: {
    position: 'relative',
    zIndex: 1,
    margin: '0 0 8px',
    fontSize: '20px',
    letterSpacing: '2px'
  },

  lockedText: {
    position: 'relative',
    zIndex: 1,
    margin: 0,
    color: '#cbd5e1',
    fontSize: '13px',
    lineHeight: 1.45
  },

  lockedHint: {
    position: 'relative',
    zIndex: 1,
    display: 'block',
    marginTop: '12px',
    color: '#d6b35a',
    fontWeight: 800
  },

  bottomNav: {
    position: 'fixed',
    left: '50%',
    bottom: '14px',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 28px)',
    maxWidth: '398px',
    padding: '8px',
    borderRadius: '24px',
    background: 'rgba(2, 6, 23, 0.94)',
    border: '1px solid rgba(214,179,90,0.18)',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '5px',
    boxShadow: '0 16px 36px rgba(0,0,0,0.48)',
    zIndex: 20
  },

  profileCard: {
    padding: '24px',
    borderRadius: '28px',
    background: '#0f172a',
    border: '1px solid rgba(214,179,90,0.18)',
    textAlign: 'center',
    boxShadow: '0 14px 30px rgba(0,0,0,0.32)'
  },

  profileAvatar: {
    width: '72px',
    height: '72px',
    margin: '0 auto',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #d6b35a, #7c2d12)',
    color: '#1c1204',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 900
  },

  profileStatGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginTop: '16px'
  },

  profileStat: {
    padding: '16px',
    borderRadius: '20px',
    background: '#0f172a',
    border: '1px solid rgba(148,163,184,0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    textAlign: 'center'
  },

  settingsBox: {
    marginTop: '16px',
    padding: '16px',
    borderRadius: '22px',
    background: '#0f172a',
    border: '1px solid rgba(214,179,90,0.18)',
    display: 'grid',
    gap: '14px'
  },

  smallGoldButton: {
    marginTop: '8px',
    border: 0,
    borderRadius: '999px',
    padding: '9px 12px',
    background: 'linear-gradient(135deg, #d6b35a, #b8892f)',
    color: '#1c1204',
    fontWeight: 900,
    cursor: 'pointer'
  },

  logoutButton: {
    width: '100%',
    marginTop: '16px',
    padding: '14px',
    borderRadius: '16px',
    border: '1px solid rgba(148,163,184,0.3)',
    background: '#111827',
    color: '#f8fafc',
    fontWeight: 900,
    cursor: 'pointer'
  },

  emptyBox: {
    padding: '18px',
    borderRadius: '18px',
    background: '#0f172a',
    border: '1px dashed #475569',
    color: '#94a3b8'
  },

  completeBox: {
    padding: '18px',
    borderRadius: '18px',
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid #22c55e',
    color: '#86efac',
    fontWeight: 900
  },

  errorBox: {
    padding: '14px',
    borderRadius: '16px',
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid #ef4444',
    color: '#fecaca',
    marginBottom: '14px'
  }
}
