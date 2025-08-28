import { useEffect, useState } from 'react'
import { acceptFriend, deleteFriend, getFriends, getPendingRequests, rejectFriend, reportFriend, sendFriendRequest } from '../api/friends'
import { useAuth } from '../store/auth'

export default function Friends() {
  const me = useAuth((s) => s.me)
  const [list, setList] = useState<any[]>([])
  const [pending, setPending] = useState<any[]>([])
  const [targetId, setTargetId] = useState('')

  const load = async () => {
    if (!me?.id) return
    const f = await getFriends(me.id)
    setList(f?.data ?? [])
    const r = await getPendingRequests(me.id)
    setPending(r?.data ?? [])
  }

  useEffect(() => { load() }, [me?.id])

  return (
    <div style={{ padding: 24 }}>
      <h1>친구</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="상대 ID" value={targetId} onChange={(e) => setTargetId(e.target.value)} />
        <button onClick={async () => { await sendFriendRequest(me!.id, Number(targetId)); await load() }}>요청</button>
        <button onClick={async () => { await reportFriend(me!.id, Number(targetId)); await load() }}>신고</button>
      </div>

      <h2>대기 중 요청</h2>
      <ul>
        {pending.map((p: any) => (
          <li key={p.id}>
            #{p.id} {p.nickname} / {p.team}
            <button onClick={async () => { await acceptFriend(me!.id, p.id); await load() }} style={{ marginLeft: 8 }}>수락</button>
            <button onClick={async () => { await rejectFriend(me!.id, p.id); await load() }} style={{ marginLeft: 8 }}>거절</button>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: 16 }}>내 친구</h2>
      <ul>
        {list.map((f: any) => (
          <li key={f.id}>
            #{f.id} {f.nickname} / {f.team}
            <button onClick={async () => { await deleteFriend(me!.id, f.id); await load() }} style={{ marginLeft: 8 }}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
