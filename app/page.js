'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileSaved, setProfileSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        console.error('사용자 조회 실패:', error)
        setErrorMessage('사용자 정보를 불러오지 못했습니다.')
        setLoading(false)
        return
      }

      const currentUser = data.user
      setUser(currentUser)

      if (currentUser) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: currentUser.id,
            nickname:
              currentUser.user_metadata?.name ||
              currentUser.user_metadata?.full_name ||
              currentUser.email,
            level: 1,
            exp: 0
          })

        if (profileError) {
          console.error('프로필 저장 실패:', profileError)
          setErrorMessage('프로필 저장에 실패했습니다.')
        } else {
          console.log('프로필 저장 성공')
          setProfileSaved(true)
        }
      }

      setLoading(false)
    }

    loadUser()
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

          <p>레벨 1</p>
          <p>경험치 0</p>
          <p>보유 카드 0장</p>

          {profileSaved && (
            <p style={{ color: 'green' }}>
              프로필 저장 완료
            </p>
          )}

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
