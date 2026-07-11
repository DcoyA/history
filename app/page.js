'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
        if (data.user) {
          await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              nickname: data.user.user_metadata?.name
            })
        }
    })
  }, [])

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  return (
    <main style={{ padding: '40px' }}>
      <h1>Hi-Story</h1>

      {user ? (
        <>
          <p>안녕하세요 {user.user_metadata?.name} 님</p>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <button onClick={login}>Google 로그인</button>
      )}
    </main>
  )
}
