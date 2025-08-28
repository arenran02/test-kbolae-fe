import axios from 'axios'
import { useAuth } from '../store/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true // refresh/pending 쿠키 주고받기 위해 필수
})

// 요청 인터셉터: Authorization 헤더
api.interceptors.request.use((config) => {
  const token = useAuth.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 응답 인터셉터: 401 → refresh 시도 후 재요청
let refreshing = false
let queue: Array<() => void> = []

async function refreshToken() {
  try {
    await api.post('/auth/token/refresh') // 스펙상 응답 {} 이지만 서버가 Set-Cookie 하거나 body로 토큰을 줄 수 있음
    return true
  } catch {
    return false
  }
}

api.interceptors.request.use((config) => {
  const token = useAuth.getState().accessToken

  // ✅ /auth로 시작하는 엔드포인트에는 토큰을 붙이지 않음
  const url = (config.url || '')
  const isAuthPath = url.startsWith('/auth/')

  if (token && !isAuthPath) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    // 혹시 남아있을 수도 있는 Authorization 제거
    if (config.headers && 'Authorization' in config.headers) {
      delete (config.headers as any).Authorization
    }
  }
  return config
})

export default api
