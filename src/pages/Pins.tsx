// src/pages/Pins.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import KakaoMap from '../components/KakaoMap'
import { createPin, deletePin, getPins } from '../api/pins'

// Vite 기준, CRA/Next.js는 process.env / NEXT_PUBLIC_ 접두사 사용
const APPKEY = import.meta.env.VITE_KAKAO_APPKEY as string

export default function Pins() {
  const [bbox, setBbox] = useState('126.8,37.3,127.2,37.7')
  const [pins, setPins] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 가시성 필터 상태
  const [vis, setVis] = useState<{ PUBLIC: boolean; FRIENDS: boolean; PRIVATE: boolean }>({
    PUBLIC: true,
    FRIENDS: false,
    PRIVATE: false,
  })

  // 체크박스로 선택된 가시성 리스트
  const visibilityList = useMemo<('PUBLIC' | 'FRIENDS' | 'PRIVATE')[]>(() => {
    return (['PUBLIC', 'FRIENDS', 'PRIVATE'] as const).filter((v) => !!vis[v])
  }, [vis])

  // API 호출
  const load = useCallback(
    async (overrideBbox?: string) => {
      setLoading(true)
      try {
        const box = overrideBbox ?? bbox
        const visParam = visibilityList.length > 0 ? visibilityList : undefined
        const data = await getPins({ bbox: box, limit: 200, visibility: visParam })
        setPins(Array.isArray(data) ? data : [])
        if (overrideBbox) setBbox(overrideBbox)
      } finally {
        setLoading(false)
      }
    },
    [bbox, visibilityList],
  )

  // 초기 로드
  useEffect(() => {
    load()
  }, [])

  // 필터 바뀔 때마다 다시 로드
  useEffect(() => {
    load()
  }, [visibilityList.join(',')])

  const onToggle = (key: 'PUBLIC' | 'FRIENDS' | 'PRIVATE') =>
    setVis((prev) => ({ ...prev, [key]: !prev[key] }))

  // 지도의 bounds가 바뀌면 호출됨
  const handleBoundsChange = useCallback(
    (box: string) => {
      if ((handleBoundsChange as any)._timer) clearTimeout((handleBoundsChange as any)._timer)
      ;(handleBoundsChange as any)._timer = setTimeout(() => {
        load(box)
      }, 200)
    },
    [load],
  )

  // 지도 클릭 → 새 핀 생성
  const handleCreatePinOnMap = useCallback(
    async (lat: number, lng: number, description: string) => {
      await createPin({ lat, lng, description, visibility: 'PUBLIC' })
      await load()
    },
    [load],
  )

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>
        핀{' '}
        <small style={{ color: '#6b7280', fontSize: 14 }}>
          {loading ? '로딩 중…' : `${pins.length}개`}
        </small>
      </h1>

      {/* 필터 UI */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '8px 0 12px' }}>
        <label>
          <input type="checkbox" checked={vis.PUBLIC} onChange={() => onToggle('PUBLIC')} /> PUBLIC
        </label>
        <label>
          <input type="checkbox" checked={vis.FRIENDS} onChange={() => onToggle('FRIENDS')} /> FRIENDS
        </label>
        <label>
          <input type="checkbox" checked={vis.PRIVATE} onChange={() => onToggle('PRIVATE')} /> PRIVATE
        </label>
        <button onClick={() => load()} style={{ marginLeft: 'auto' }}>
          적용
        </button>
      </div>

      {/* 지도 */}
      <KakaoMap
        appkey={APPKEY}
        pins={Array.isArray(pins) ? pins : []}
        onBoundsChange={handleBoundsChange}
        onCreatePin={handleCreatePinOnMap}
      />

      {/* BBOX 수동 입력 */}
      <div style={{ margin: '12px 0' }}>
        <input style={{ width: 420 }} value={bbox} onChange={(e) => setBbox(e.target.value)} />
        <button onClick={() => load(bbox)} style={{ marginLeft: 8 }}>
          BBOX로 불러오기
        </button>
      </div>

      {/* 핀 목록/삭제 */}
      <ul style={{ marginTop: 8 }}>
        {pins.map((p: any) => (
          <li key={p.id ?? Math.random()} style={{ marginBottom: 6 }}>
            #{p.id} ({Number(p.lat)?.toFixed?.(5) ?? p.lat}, {Number(p.lng)?.toFixed?.(5) ?? p.lng}){' '}
            {p.description ?? ''} [{p.visibility}]
            <button
              onClick={() => deletePin(p.id).then(() => load())}
              style={{ marginLeft: 8 }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
