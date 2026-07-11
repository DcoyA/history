'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [ownedCards, setOwnedCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileSaved, setProfileSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
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
        console.log('프로필 저장 성공:', savedProfile)
        setProfile(savedProfile)
        setProfileSaved(true)
      }

      const { data: userCardsData, error: userCardsError } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', currentUser.id)

      if (userCardsError) {
        console.error('보유 카드 조회 실패:', userCardsError)
        setErrorMessage('보유 카드 정보를 불러오지 못했습니다.')
        setLoading(false)
        return
      }

      if (!userCardsData || userCardsData.length === 0) {
        setOwnedCards([])
        setLoading(false)
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
        setLoading(false)
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
      setLoading(false)
    }

    loadData()
  }, [])

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

  if (loading) {
    return (
      <main style={{ padding: '40px' }}>
        <h1>Hi-Story</h1>
        <p>불러오는 중...</p>
      </main>
    )
  }

  return (
    <main style={{ padding: '40px' }}>
      <h1>Hi-Story</h1>
      <p>역사 카드 수집 RPG</p>

      {errorMessage && (
        <p style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}

      {user ? (
        <div>
          <p>
            안녕하세요{' '}
            {user.user_metadata?.name ||
              user.user_metadata?.full_name ||
              user.email}{' '}
            님
          </p>

          <p>레벨 {profile?.level ?? 1}</p>
          <p>경험치 {profile?.exp ?? 0}</p>
          <p>보유 카드 {ownedCards.length}장</p>

          {profileSaved && (
            <p style={{ color: 'green' }}>
              프로필 저장 완료
            </p>
          )}

          <hr style={{ margin: '24px 0' }} />

          <h2>내 카드</h2>

          {ownedCards.length === 0 ? (
            <p>아직 보유한 카드가 없습니다.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px', maxWidth: '520px' }}>
              {ownedCards.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    padding: '16px',
                    background: '#fafafa'
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

                  <p style={{ margin: '4px 0' }}>
                    보유 수량: {item.count || 1}
                  </p>
                </div>
              ))}
            </div>
          )}

          <br />

          <button onClick={logout}>
            로그아웃
          </button>
        </div>
      ) : (
        <button onClick={login}>
          Google 로그인
        </button>
      )}
    </main>
  )
}
