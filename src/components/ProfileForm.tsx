import { useEffect, useState } from 'react'
import { getMyProfile, updateMyProfile } from '../api/users'
import { useAuth } from '../store/auth'
import type { Profile } from '../lib/types'

export default function ProfileForm() {
  const [me, setMe] = useState<Profile | null>(null)
  const setStoreMe = useAuth((s) => s.setMe)

  useEffect(() => {
    ;(async () => {
      try {
        const p = await getMyProfile()
        setMe(p)
        setStoreMe(p)
      } catch (e: any) {
        console.error(e)
      }
    })()
  }, [setStoreMe])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!me) return
    const payload = {
      nickname: me.nickname,
      team: me.team,
      statusMessage: me.statusMessage,
      profileImageUrl: me.profileImageUrl,
      mbti: me.mbti
    }
    const res = await updateMyProfile(payload)
    alert(res.message ?? '수정 완료')
  }

  if (!me) return <div>프로필 로딩…</div>

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
      <label className="label">닉네임 <input value={me.nickname} onChange={(e) => setMe({ ...me, nickname: e.target.value })} /></label>
      <label className="label">팀 <input value={me.team ?? ''} onChange={(e) => setMe({ ...me, team: e.target.value })} /></label>
      <label className="label">상태메시지 <input value={me.statusMessage ?? ''} onChange={(e) => setMe({ ...me, statusMessage: e.target.value })} /></label>
      <label className="label">프로필 이미지 URL <input value={me.profileImageUrl ?? ''} onChange={(e) => setMe({ ...me, profileImageUrl: e.target.value })} /></label>
      <label className="label">MBTI <input value={me.mbti ?? ''} onChange={(e) => setMe({ ...me, mbti: e.target.value })} /></label>
      <button type="submit">저장</button>
    </form>
  )
}
