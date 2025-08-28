// src/hooks/useKakaoLoader.ts
import { useEffect, useState } from 'react'

const APPKEY = import.meta.env.VITE_KAKAO_APPKEY as string

declare global {
  interface Window {
    kakao: any
  }
}


export function useKakaoLoader(appkey: string, libraries: string[] = []) {
  const [loaded, setLoaded] = useState<boolean>(!!window.kakao?.maps)

  useEffect(() => {
    if (window.kakao?.maps) {
      setLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APPKEY}&autoload=false`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => setLoaded(true))
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [appkey])

  return loaded
}
