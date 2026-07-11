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
      setResultMessage('오답입니다. 다시 도전해보세요.')
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
      setResultMessage('정답입니다.')
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
      setResultMessage('정답입니다.')
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
        setResultMessage('정답입니다.')
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
        setResultMessage('정답입니다.')
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
      <main style={{ padding: '40px' }}>
        <h1>Hi-Story</h1>
        <p>불러오는 중...</p>
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
    <main
      style={{
        padding: '32px',
        maxWidth: '960px',
        margin: '0 auto',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <section
        style={{
          padding: '28px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #111827, #312e81)',
          color: 'white',
          marginBottom: '28px'
        }}
      >
        <h1 style={{ margin: '0 0 8px', fontSize: '40px' }}>Hi-Story</h1>
        <p style={{ margin: '0 0 20px', color: '#ddd' }}>
          한국사 퀴즈를 풀고 고구려 도감을 완성하세요.
        </p>

        {!user ? (
          <button
            onClick={login}
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              border: '0',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Google 로그인
          </button>
        ) : (
          <div>
            <p style={{ margin: '0 0 10px' }}>
              안녕하세요{' '}
              {user.user_metadata?.name ||
                user.user_metadata?.full_name ||
                user.email}{' '}
              님
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '18px'
              }}
            >
              <div style={statBoxStyle}>
                <strong>레벨</strong>
                <span>{profile?.level ?? 1}</span>
              </div>

              <div style={statBoxStyle}>
                <strong>경험치</strong>
                <span>{profile?.exp ?? 0}</span>
              </div>

              <div style={statBoxStyle}>
                <strong>도감</strong>
                <span>
                  {ownedCount} / {totalCount}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}
              >
                <span>고구려 도감 완성도</span>
                <strong>{collectionRate}%</strong>
              </div>

              <div
                style={{
                  height: '14px',
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${collectionRate}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #22c55e, #fde047)',
                    borderRadius: '999px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {errorMessage && (
        <p style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}

      {user && (
        <>
          <section style={{ marginBottom: '32px' }}>
            <h2>고구려 퀴즈</h2>

            {!currentLesson ? (
              <p>등록된 퀴즈가 없습니다.</p>
            ) : (
              <div
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  padding: '24px',
                  background: '#fafafa'
                }}
              >
                <p style={{ fontSize: '14px', color: '#666' }}>
                  문제 {currentLessonIndex + 1} / {lessons.length}
                </p>

                <h3 style={{ fontSize: '21px', lineHeight: 1.5 }}>
                  {currentLesson.question}
                </h3>

                <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
