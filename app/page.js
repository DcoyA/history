'use client'

import { supabase } from '../lib/supabase'

export default function Home() {

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  return (
    <main style={{padding:'40px'}}>
      <h1>Hi-Story</h1>

      <p>역사 카드 수집 RPG</p>

      <button onClick={login}>
        Google 로그인
      </button>
    </main>
  )
}
