import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { kakaoRegister } from '../api/auth'
import { useAuth } from '../store/auth'

export default function Register() {
  const nav = useNavigate()
  const { state } = useLocation() as { state?: { email?: string } }
  const [form, setForm] = useState({ nickname: '', team: '', statusMessage: '', mbti: 'INTJ' })
  const setToken = useAuth((s) => s.setToken)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await kakaoRegister(form)
      if (res?.data?.accessToken) {
        setToken(res.data.accessToken)
        nav('/', { replace: true })
      } else {
        alert('회원가입은 되었으나 토큰이 수신되지 않았습니다. 다시 로그인해 주세요.')
        nav('/login', { replace: true })
      }
    } catch (e: any) {
      alert(e?.response?.data?.message ?? '회원가입 중 오류가 발생했습니다.')
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>회원가입</h1>
      {state?.email && <p>이메일: {state.email}</p>}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        <input placeholder="닉네임" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} required />
        <input placeholder="응원팀 (예: SSG)" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} required />
        <input placeholder="상태메시지" value={form.statusMessage} onChange={(e) => setForm({ ...form, statusMessage: e.target.value })} />
        <input placeholder="MBTI (예: INTJ)" value={form.mbti} onChange={(e) => setForm({ ...form, mbti: e.target.value })} />
        <button type="submit">가입하기</button>
      </form>
    </div>
  )
}
