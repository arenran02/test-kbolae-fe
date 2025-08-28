// src/components/KakaoMap.tsx
import { useEffect, useMemo, useRef } from 'react'
import { useKakaoLoader } from '../hooks/useKakaoLoader'

type Pin = {
  id: number
  lat: number
  lng: number
  description?: string
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE'
}

type Props = {
  appkey: string
  pins: Pin[]
  onBoundsChange?: (bbox: string) => void // "minLng,minLat,maxLng,maxLat"
  onCreatePin?: (lat: number, lng: number, description: string) => Promise<void> | void
}

export default function KakaoMap({ appkey, pins, onBoundsChange, onCreatePin }: Props) {
  const loaded = useKakaoLoader(appkey)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapObj = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // 초기 중심/줌
  const initialCenter = useMemo(() => ({ lat: 37.5665, lng: 126.9780 }), [])

  // 지도 초기화
  useEffect(() => {
    if (!loaded || !mapRef.current) return
    const { kakao } = window
    const center = new kakao.maps.LatLng(initialCenter.lat, initialCenter.lng)
    const map = new kakao.maps.Map(mapRef.current, { center, level: 5 }) // level: 작을수록 확대
    mapObj.current = map

    // bounds 변경 시 BBOX 계산해서 콜백
    const handleMoveEnd = () => {
      const b = map.getBounds()
      // kakao는 (남서, 북동)
      const sw = b.getSouthWest()
      const ne = b.getNorthEast()
      const minLng = sw.getLng()
      const minLat = sw.getLat()
      const maxLng = ne.getLng()
      const maxLat = ne.getLat()
      onBoundsChange?.(`${minLng},${minLat},${maxLng},${maxLat}`)
    }

    kakao.maps.event.addListener(map, 'tilesloaded', handleMoveEnd)
    kakao.maps.event.addListener(map, 'dragend', handleMoveEnd)
    kakao.maps.event.addListener(map, 'zoom_changed', handleMoveEnd)

    // 지도 클릭 → 핀 생성
    if (onCreatePin) {
      kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng
        const lat = latlng.getLat()
        const lng = latlng.getLng()
        const desc = window.prompt('이 위치에 핀 설명을 입력하세요 (최대 500자):') || ''
        if (desc.trim().length > 0) {
          onCreatePin(lat, lng, desc.trim())
        }
      })
    }

    return () => {
      kakao.maps.event.removeListener(map, 'tilesloaded', handleMoveEnd)
      kakao.maps.event.removeListener(map, 'dragend', handleMoveEnd)
      kakao.maps.event.removeListener(map, 'zoom_changed', handleMoveEnd)
    }
  }, [loaded, initialCenter, onBoundsChange, onCreatePin])

  // 마커 렌더링
  useEffect(() => {
    if (!loaded || !mapObj.current) return
    const { kakao } = window
    const map = mapObj.current

    // 기존 마커 제거
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    pins.forEach((p) => {
      const pos = new kakao.maps.LatLng(p.lat, p.lng)
      const marker = new kakao.maps.Marker({ position: pos })
      marker.setMap(map)

      // 인포윈도우
      if (p.description) {
        const iw = new kakao.maps.InfoWindow({
          content: `<div style="padding:8px;max-width:220px">${escapeHtml(p.description)}<br/><small>[${p.visibility}] #${p.id}</small></div>`
        })
        kakao.maps.event.addListener(marker, 'mouseover', () => iw.open(map, marker))
        kakao.maps.event.addListener(marker, 'mouseout', () => iw.close())
        // 클릭 고정 열림 원하면 click 리스너로 토글 구현
      }

      markersRef.current.push(marker)
    })
  }, [loaded, pins])

  // 현재 위치로 이동 버튼
  const goMyLocation = async () => {
    if (!mapObj.current) return
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치를 지원하지 않습니다.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { kakao } = window
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const latlng = new kakao.maps.LatLng(lat, lng)
        mapObj.current.setCenter(latlng)
        mapObj.current.setLevel(4)
      },
      (err) => {
        console.error(err)
        alert('현재 위치를 가져올 수 없습니다.')
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000 }
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 480, borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,.08)' }}>
      {!loaded && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>지도를 불러오는 중…</div>}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <button
        onClick={goMyLocation}
        style={{
          position: 'absolute', top: 12, right: 12,
          padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer'
        }}
        title="현재 위치로 이동"
      >
        현재 위치
      </button>
    </div>
  )
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch] as string))
}
