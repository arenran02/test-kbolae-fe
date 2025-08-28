// src/api/pins.ts
import api from '../lib/axios'

type Visibility = 'PUBLIC' | 'FRIENDS' | 'PRIVATE'

/** BBOX 조회: visibility를 콤마로 직렬화해서 서버에 전달 */
export async function getPins(params: {
  bbox: string
  limit?: number
  since?: string
  visibility?: Visibility[] // ✅ 추가
}) {
  const q = new URLSearchParams()
  q.set('bbox', params.bbox)
  if (params.limit != null) q.set('limit', String(params.limit))
  if (params.since) q.set('since', params.since)
  if (params.visibility && params.visibility.length > 0) {
    q.set('visibility', params.visibility.join(',')) // ✅ visibility=PUBLIC,FRIENDS
  }

  const { data } = await api.get(`/api/pins?${q.toString()}`)
  return Array.isArray(data) ? data : []
}

/** 핀 생성 */
export async function createPin(payload: {
  lat: number
  lng: number
  description?: string
  visibility: Visibility
  expiresInSec?: number
}) {
  const { data } = await api.post('/api/pins', payload)
  return data
}

/** 반경 검색 */
export async function getPinsNear(params: {
  lat: number
  lng: number
  radius?: number
  limit?: number
  since?: string
  visibility?: Visibility[] // 원하면 반경에도 동일 규약 사용 가능
}) {
  // 필요시 visibility 지원:
  const q = new URLSearchParams()
  q.set('lat', String(params.lat))
  q.set('lng', String(params.lng))
  if (params.radius != null) q.set('radius', String(params.radius))
  if (params.limit != null) q.set('limit', String(params.limit))
  if (params.since) q.set('since', params.since)
  if (params.visibility?.length) q.set('visibility', params.visibility.join(','))

  const { data } = await api.get(`/api/pins/near?${q.toString()}`)
  return Array.isArray(data) ? data : []
}

/** 삭제 */
export async function deletePin(id: number) {
  const { data } = await api.delete(`/api/pins/${id}`)
  return data
}
