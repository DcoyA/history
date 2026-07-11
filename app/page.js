'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [ownedCards, setOwnedCards] = useState([])
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [resultMessage, setResultMessage] = useState('')
  const [rewardMessage, setRewardMessage] = useState('')
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

    await loadLessons()
    await loadOwnedCards(currentUser.id)

    setLoading(false)
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
      setRewardMessage(
        `${rewardCard.name} 카드를 이미 보유 중입니다. 수량이 ${nextCount}장으로 증가했습니다.`
      )
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
  }

  const goNextQuiz = () => {
    setSelectedChoice(null)
    setResultMessage('')
    setRewardMessage('')

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

  return (
    <main style={{ padding: '40px', maxWidth: '760px' }}>
      <h1>Hi-Story</h1>
      <p>역사 카드 수집형 학습 RPG</p>

      {errorMessage && (
        <p style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}

      {!user ? (
        <button onClick={login}>
          Google 로그인
        </button>
      ) : (
        <div>
          <section style={{ marginBottom: '28px' }}>
            <p>
              안녕하세요{' '}
              {user.user_metadata?.name ||
                user.user_metadata?.full_name ||
                user.email}{' '}
              님
            </p>

            <p>레벨 {profile?.level ?? 1}</p>
            <p>경험치 {profile?.exp ?? 0}</p>
            <p>보유 카드 {ownedCards.length}종</p>
          </section>

          <hr style={{ margin: '24px 0' }} />

          <section style={{ marginBottom: '32px' }}>
            <h2>고구려 퀴즈</h2>

            {!currentLesson ? (
              <p>등록된 퀴즈가 없습니다.</p>
            ) : (
              <div
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '16px',
                  padding: '20px',
                  background: '#fafafa'
                }}
              >
                <p style={{ fontSize: '14px', color: '#666' }}>
                  문제 {currentLessonIndex + 1} / {lessons.length}
                </p>

                <h3>{currentLesson.question}</h3>

                <div style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
                  {[1, 2, 3, 4].map((number) => {
                    const choiceText = currentLesson[`choice${number}`]
                    const isSelected = selectedChoice === number
                    const isCorrectChoice = number === currentLesson.answer
                    const answeredCorrectly = resultMessage.includes('정답')

                    let background = '#fff'
                    let border = '1px solid #ccc'

                    if (isSelected) {
                      background = '#eef2ff'
                      border = '2px solid #111'
                    }

                    if (answeredCorrectly && isCorrectChoice) {
                      background = '#dcfce7'
                      border = '2px solid #16a34a'
                    }

                    return (
                      <button
                        key={number}
                        onClick={() => handleAnswer(number)}
                        disabled={answeredCorrectly}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderRadius: '10px',
                          border,
                          background,
                          cursor: answeredCorrectly ? 'default' : 'pointer'
                        }}
                      >
                        {number}. {choiceText}
                      </button>
                    )
                  })}
                </div>

                {resultMessage && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '14px',
                      borderRadius: '12px',
                      background: resultMessage.includes('정답')
                        ? '#f0fdf4'
                        : '#fff1f2',
                      border: resultMessage.includes('정답')
                        ? '1px solid #86efac'
                        : '1px solid #fecdd3'
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 6px',
                        color: resultMessage.includes('정답')
                          ? 'green'
                          : 'crimson',
                        fontWeight: 'bold'
                      }}
                    >
                      {resultMessage}
                    </p>

                    {rewardMessage && (
                      <p style={{ margin: 0 }}>
                        {rewardMessage}
                      </p>
                    )}
                  </div>
                )}

                {resultMessage.includes('정답입니다') && (
                  <button
                    onClick={goNextQuiz}
                    style={{ marginTop: '12px' }}
                  >
                    다음 문제
                  </button>
                )}
              </div>
            )}
          </section>

          <hr style={{ margin: '24px 0' }} />

          <section>
            <h2>내 도감</h2>

            {ownedCards.length === 0 ? (
              <p>아직 획득한 카드가 없습니다.</p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {ownedCards.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '12px',
                      padding: '16px',
                      background: '#fff'
                    }}
                  >
                    <h3 style={{ margin: '0 0 8px' }}>
                      {item.card?.name || '이름 없는 카드'}
                    </h3>

                    <p style={{ margin: '4px 0' }}>
                      시대: {item.card?.era || '-'}
                    </p>

                    <p style={{ margin: '4px 0' }}>
                      분류: {item.card?.category || '-'}
                    </p>

                    <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
                      보유 수량: {item.count || 1}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <br />

          <button onClick={logout}>
            로그아웃
          </button>
        </div>
      )}
    </main>
  )
}
