import { useState } from 'react'
import { searchUsers } from '../api/users'

export default function SearchUsers() {
  const [form, setForm] = useState({ nickname: '', team: '', minAge: '', maxAge: '' })
  const [result, setResult] = useState<any>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = {}
    if (form.nickname) payload.nickname = form.nickname
    if (form.team) payload.team = form.team
    if (form.minAge) payload.minAge = Number(form.minAge)
    if (form.maxAge) payload.maxAge = Number(form.maxAge)

    if (Object.keys(payload).length === 0) {
      alert('검색 조건을 최소 1개 이상 입력해야 합니다.')
      return
    }
    const data = await searchUsers(payload)
    setResult(data)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>사용자 검색</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="닉네임" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
        <input placeholder="팀" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} />
        <input placeholder="최소 나이" value={form.minAge} onChange={(e) => setForm({ ...form, minAge: e.target.value })} />
        <input placeholder="최대 나이" value={form.maxAge} onChange={(e) => setForm({ ...form, maxAge: e.target.value })} />
        <button type="submit">검색</button>
      </form>

      <div style={{ marginTop: 16 }}>
        {result?.data?.length ? (
          <ul>
            {result.data.map((u: any) => (
              <li key={u.id}>
                #{u.id} {u.nickname} / {u.team} / {u.age ?? '-'}
              </li>
            ))}
          </ul>
        ) : result ? (
          <p>검색 결과가 없습니다.</p>
        ) : null}
      </div>
    </div>
  )
}
