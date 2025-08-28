import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { kakaoLoginExchange } from '../api/auth'
import { useAuth } from '../store/auth'

export default function AuthCallback() {
  const nav = useNavigate()
  const { search } = useLocation()
  const setToken = useAuth((s) => s.setToken)

  // ✅ 개발 모드 StrictMode의 이펙트 2회 실행을 막는 가드
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (hasRunRef.current) return
    hasRunRef.current = true

    const params = new URLSearchParams(search)
    const code = params.get('code')
    if (!code) {
      nav('/login', { replace: true })
      return
    }

    // ✅ 같은 code로 중복 교환 방지(뒤로가기/새로고침 시)
    const seenKey = `kakao_code_${code}`
    if (sessionStorage.getItem(seenKey)) {
      // 이미 처리한 code면 홈으로
      nav('/', { replace: true })
      return
    }

    ;(async () => {
      try {
        const res = await kakaoLoginExchange(code)
        sessionStorage.setItem(seenKey, '1')

        if (res?.data?.accessToken) {
          setToken(res.data.accessToken)
          nav('/', { replace: true })
          return
        }
        if (res?.code === 'NEEDS_REGISTER' || res?.data?.redirect) {
          nav('/register', { replace: true, state: { email: res?.data?.email } })
          return
        }
        alert('로그인 처리 실패')
        nav('/login', { replace: true })
      } catch (e: any) {
        alert(e?.response?.data?.message ?? '로그인 중 오류')
        nav('/login', { replace: true })
      }
    })()
  }, [search, nav, setToken])

  return <div style={{ padding: 24 }}>로그인 처리 중…</div>
}