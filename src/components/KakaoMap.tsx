import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

type PinItem = {
  id?: number
  lat: number
  lng: number
  description?: string
  visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE'
}

type Props = {
  appkey: string
  pins: PinItem[]
  onBoundsChange?: (bbox: string) => void
  /** 지도에서 클릭 시 핀 생성: (lat, lng, description) */
  onCreatePin?: (lat: number, lng: number, description: string) => Promise<any> | void
  /** 현재 위치 버튼 표시 여부 */
  showLocateButton?: boolean
}

export default function KakaoMap({
  appkey,
  pins,
  onBoundsChange,
  onCreatePin,
  showLocateButton = true,
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapObjRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [sdkReady, setSdkReady] = useState(false)

  // Kakao Maps SDK 로더
  useEffect(() => {
    const hasMaps = !!window.kakao?.maps
    if (hasMaps) {
      setSdkReady(true)
      return
    }

    const id = 'kakao-map-sdk'
    const exist = document.getElementById(id) as HTMLScriptElement | null
    const onScriptLoad = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => setSdkReady(true))
      } else {
        console.error('[KakaoMap] kakao.maps not found after script load (check key & domain)')
      }
    }

    if (exist) {
      exist.addEventListener('load', onScriptLoad)
      return
    }

    const script = document.createElement('script')
    script.id = id
    script.async = true
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false`
    script.onload = onScriptLoad
    script.onerror = () => console.error('[KakaoMap] SDK script failed to load')
    document.head.appendChild(script)
  }, [appkey])

  // 지도 초기화
  useEffect(() => {
    if (!sdkReady || !mapRef.current) return
    const maps = window.kakao?.maps
    if (!maps || typeof maps.LatLng !== 'function' || typeof maps.Map !== 'function') {
      console.error('[KakaoMap] maps API is not ready (LatLng/Map missing)')
      return
    }

    const center = new maps.LatLng(37.5665, 126.9780) // 서울시청
    const map = new maps.Map(mapRef.current, { center, level: 5 })
    mapObjRef.current = map

    maps.event.addListener(map, 'idle', () => {
      if (!onBoundsChange) return
      const b = map.getBounds()
      const sw = b.getSouthWest()
      const ne = b.getNorthEast()
      const bbox = [sw.getLng(), sw.getLat(), ne.getLng(), ne.getLat()].join(',')
      onBoundsChange(bbox)
    })

    if (onCreatePin) {
      maps.event.addListener(map, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng
        const lat = latlng.getLat()
        const lng = latlng.getLng()
        const description = window.prompt('이 위치에 핀을 만드시겠어요? (설명 입력)') || ''
        if (description.trim().length === 0) return
        Promise.resolve(onCreatePin(lat, lng, description)).catch((e) =>
          console.error('createPin error', e),
        )
      })
    }
  }, [sdkReady, onBoundsChange, onCreatePin])

  // 마커 렌더링
  useEffect(() => {
    const map = mapObjRef.current
    const maps = window.kakao?.maps
    if (!sdkReady || !map || !maps) return

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    ;(pins ?? []).forEach((p) => {
      const pos = new maps.LatLng(p.lat, p.lng)
      const marker = new maps.Marker({ map, position: pos })
      markersRef.current.push(marker)

      if (p.description) {
        const iw = new maps.InfoWindow({
          content: `<div style="padding:6px 10px">${escapeHtml(p.description)}</div>`,
        })
        maps.event.addListener(marker, 'click', () => {
          iw.open(map, marker)
          setTimeout(() => {
            maps.event.addListener(map, 'click', () => iw.close())
          }, 0)
        })
      }
    })
  }, [pins, sdkReady])

  // 현재 위치로 이동 + (선택) 핀 생성
  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 정보를 지원하지 않아요.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const maps = window.kakao?.maps
        const map = mapObjRef.current
        if (!maps || !map) return

        const latlng = new maps.LatLng(latitude, longitude)
        map.panTo(latlng)

        const marker = new maps.Marker({ map, position: latlng })
        markersRef.current.push(marker)

        if (onCreatePin) {
          const ok = confirm('현재 위치에 핀을 생성할까요?')
          if (ok) {
            const desc = window.prompt('핀 설명을 입력하세요') || ''
            if (desc.trim().length > 0) {
              Promise.resolve(onCreatePin(latitude, longitude, desc)).catch((e) =>
                console.error('createPin error', e),
              )
            }
          }
        }
      },
      (err) => {
        console.error(err)
        alert(
          err.code === err.PERMISSION_DENIED
            ? '위치 권한을 허용해 주세요.'
            : '현재 위치를 가져오지 못했어요.',
        )
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 500, borderRadius: 8, overflow: 'hidden' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {showLocateButton && (
        <button
          onClick={handleLocate}
          style={{
            position: 'absolute',
            right: 12,
            bottom: 12,
            padding: '8px 12px',
            background: '#111827',
            color: 'white',
            border: 0,
            borderRadius: 8,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
        >
          내 위치로
        </button>
      )}
    </div>
  )
}

function escapeHtml(str: string) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
