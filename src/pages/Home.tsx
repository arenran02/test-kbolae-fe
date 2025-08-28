import { useEffect } from 'react'
import { useAuth } from '../store/auth'
import { getMyProfile } from '../api/users'

export default function Home() {
  const { me, setMe } = useAuth()

  useEffect(() => {
    if (me) return
    ;(async () => {
      try {
        const p = await getMyProfile()
        setMe(p)
      } catch {}
    })()
  }, [me, setMe])

  return (
    <div style={{ padding: 24 }}>
      <h1>메인</h1>
      {me ? <p>안녕하세요, <b>{me.nickname}</b>님! ({me.team})</p> : <p>프로필을 불러오는 중…</p>}
      <p>상단 네비게이션에서 기능을 사용하세요.</p>
    </div>
  )
}
