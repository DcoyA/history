'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [lessons, setLessons] = useState([])
  const [allCards, setAllCards] = useState([])
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [ownedCards, setOwnedCards] = useState([])
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [resultMessage, setResultMessage] = useState('')
  const [rewardMessage, setRewardMessage] = useState('')
  const [lastRewardCard, setLastRewardCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState('quiz')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setErrorMessage('')

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('사용자 조회 실패:', userError)
      setErrorMessage('사용자 정보를 불러오지 못했습니다.')
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
      setErrorMessage('프로필 저장에 실패했습니다.')
    } else {
      setProfile(savedProfile)
    }

    await loadAllCards()
    await loadLessons()
    await loadOwnedCards(currentUser.id)

    setLoading(false)
  }

  const loadAllCards = async () => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('전체 카드 조회 실패:', error)
      setErrorMessage('전체 카드 정보를 불러오지 못했습니다.')
      return
    }

    setAllCards(data || [])
  }

  const loadLessons = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('퀴즈 조회 실패:', error)
      setErrorMessage('퀴즈 정보를 불러오지 못했습니다.')
      return
    }

    setLessons(data || [])
  }

  const loadOwnedCards = async (userId) => {
    const { data: userCardsData, error: userCardsError } = await supabase
      .from('user_cards')
      .select('*')
      .eq('user_id', userId)
      .order('obtained_at', { ascending: false })

    if (userCardsError) {
      console.error('보유 카드 조회 실패:', userCardsError)
      setErrorMessage('보유 카드 정보를 불러오지 못했습니다.')
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
      setErrorMessage('카드 상세 정보를 불러오지 못했습니다.')
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
      setResultMessage('오답입니다')
      setRewardMessage('괜찮습니다. 다시 골라보세요.')
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
      setResultMessage('정답입니다')
      setRewardMessage('하지만 보상 카드 정보를 불러오지 못했습니다.')
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
      setResultMessage('정답입니다')
      setRewardMessage('카드 확인 중 오류가 발생했습니다.')
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
        setResultMessage('정답입니다')
        setRewardMessage('카드 저장 중 오류가 발생했습니다.')
        return
      }

      setResultMessage('정답입니다!')
      setRewardMessage(`${rewardCard.name} 카드 수량이 ${nextCount}장으로 증가했습니다.`)
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
        setResultMessage('정답입니다')
        setRewardMessage('카드 저장 중 오류가 발생했습니다.')
        return
      }

      setResultMessage('정답입니다!')
      setRewardMessage(`새 카드 획득: ${rewardCard.name}`)
    }

    await loadOwnedCards(user.id)
    await loadAllCards()
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
          <h1 style={{ marginTop: 40 }}>Hi-Story</h1>
          <p>불러오는 중...</p>
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
              <p style={eyebrowStyle}>고구려 도감</p>
              <h1 style={titleStyle}>Hi-Story</h1>
            </div>

            {user && (
              <div style={levelBadgeStyle}>
                Lv. {profile?.level ?? 1}
              </div>
            )}
          </div>

          <p style={heroTextStyle}>
            퀴즈를 풀고 역사 카드를 해금하세요.
          </p>

          {!user ? (
            <button onClick={login} style={primaryButtonStyle}>
              Google로 시작하기
            </button>
          ) : (
            <>
              <div style={progressHeaderStyle}>
                <span>도감 완성도</span>
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
                  <span>획득</span>
                </div>

                <div style={miniStatStyle}>
                  <strong>{lockedCards.length}</strong>
                  <span>미획득</span>
                </div>

                <div style={miniStatStyle}>
                  <strong>{totalCount}</strong>
                  <span>전체</span>
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

        {user && activeTab === 'collection' && (
          <CollectionView
            ownedCards={ownedCards}
            lockedCards={lockedCards}
            ownedCount={ownedCount}
            totalCount={totalCount}
            collectionRate={collectionRate}
          />
        )}

        {user && activeTab === 'profile' && (
          <ProfileView
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
              <small>퀴즈</small>
            </button>

            <button
              onClick={() => setActiveTab('collection')}
              style={tabButtonStyle(activeTab === 'collection')}
            >
              <span>📚</span>
              <small>도감</small>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              style={tabButtonStyle(activeTab === 'profile')}
            >
              <span>👤</span>
              <small>내정보</small>
            </button>
          </nav>
        )}
      </div>
    </main>
  )
}

function QuizView({
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
        <h2>오늘의 퀴즈</h2>
        <p>등록된 퀴즈가 없습니다.</p>
      </section>
    )
  }

  const answeredCorrectly = resultMessage.includes('정답')

  return (
    <section style={contentSectionStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <p style={eyebrowDarkStyle}>오늘의 도전</p>
          <h2 style={sectionTitleStyle}>고구려 퀴즈</h2>
        </div>

        <span style={pillStyle}>
          {currentLessonIndex + 1} / {lessons.length}
        </span>
      </div>

      <div style={quizCardStyle}>
        <p style={quizLabelStyle}>문제</p>
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
              background: resultMessage.includes('정답') ? '#ecfdf5' : '#fff1f2',
              borderColor: resultMessage.includes('정답') ? '#86efac' : '#fecdd3'
            }}
          >
            <strong
              style={{
                color: resultMessage.includes('정답') ? '#15803d' : '#be123c'
              }}
            >
              {resultMessage}
            </strong>

            {rewardMessage && (
              <p style={{ margin: '6px 0 0' }}>
                {rewardMessage}
              </p>
            )}

            {lastRewardCard && (
              <RewardCard card={lastRewardCard} />
            )}
          </div>
        )}

        {answeredCorrectly && (
          <button onClick={goNextQuiz} style={primaryButtonDarkStyle}>
            다음 문제로
          </button>
        )}
      </div>
    </section>
  )
}

function RewardCard({ card }) {
  const rarityStyle = getRarityStyle(card?.rarity)

  return (
    <div style={rewardCardStyle}>
      <div style={rewardTopRowStyle}>
        <span style={{ ...rarityBadgeStyle, ...rarityStyle.badge }}>
          {card?.rarity || 'N'}
        </span>

        <span style={rewardLabelStyle}>획득 보상</span>
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
          <p style={eyebrowDarkStyle}>수집 현황</p>
          <h2 style={sectionTitleStyle}>내 도감</h2>
        </div>

        <span style={pillStyle}>
          {collectionRate}%
        </span>
      </div>

      <div style={collectionSummaryStyle}>
        <strong>
          {ownedCount}종 획득
        </strong>
        <span>
          전체 {totalCount}종 중 {lockedCards.length}종 미발견
        </span>
      </div>

      <h3 style={subTitleStyle}>획득한 카드</h3>

      {ownedCards.length === 0 ? (
        <div style={emptyBoxStyle}>
          아직 획득한 카드가 없습니다.
        </div>
      ) : (
        <div style={cardGridStyle}>
          {ownedCards.map((item) => (
            <OwnedCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <h3 style={subTitleStyle}>미획득 카드</h3>

      {lockedCards.length === 0 ? (
        <div style={completeBoxStyle}>
          고구려 도감을 모두 완성했습니다!
        </div>
      ) : (
        <div style={cardGridStyle}>
          {lockedCards.map((card) => (
            <LockedCard key={card.id} />
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
        <img
          src={card.image_url}
          alt={card.name}
          style={cardImageStyle}
        />
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

function LockedCard() {
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
        아직 발견하지 못한 고구려 카드
      </p>

      <small style={lockedHintStyle}>
        퀴즈를 풀어 해금
      </small>
    </div>
  )
}

function ProfileView({
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
          고구려 도감 수집가
        </p>
      </div>

      <div style={profileStatGridStyle}>
        <div style={profileStatStyle}>
          <strong>{profile?.level ?? 1}</strong>
          <span>레벨</span>
        </div>

        <div style={profileStatStyle}>
          <strong>{profile?.exp ?? 0}</strong>
          <span>경험치</span>
        </div>

        <div style={profileStatStyle}>
          <strong>{ownedCount}/{totalCount}</strong>
          <span>도감</span>
        </div>

        <div style={profileStatStyle}>
          <strong>{collectionRate}%</strong>
          <span>완성도</span>
        </div>
      </div>

      <div style={noteBoxStyle}>
        <strong>다음 목표</strong>
        <p>
          고구려 도감을 모두 채우면 백제, 신라, 고려, 조선 콘텐츠로 확장할 수 있습니다.
        </p>
      </div>

      <button onClick={logout} style={logoutButtonStyle}>
        로그아웃
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
  return '✨'
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
  padding: '18px 16px 92px',
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
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '6px',
  boxShadow: '0 16px 36px rgba(15, 23, 42, 0.38)',
  zIndex: 20
}

const tabButtonStyle = (active) => ({
  border: 0,
  borderRadius: '18px',
  padding: '10px 6px',
  background: active ? 'white' : 'transparent',
  color: active ? '#111827' : '#d1d5db',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3px',
  fontWeight: 900,
  cursor: 'pointer'
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
