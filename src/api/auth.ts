import api from '../lib/axios'

export async function kakaoLoginExchange(code: string) {
  // XHR임을 백엔드에 알려서 302 대신 JSON을 받도록 유도 (옵션)
  const res = await api.get('/auth/kakao/login', {
    params: { code },
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  return res.data // LOGIN_SUCCESS or NEEDS_REGISTER
}

export async function kakaoRegister(payload: {
  nickname: string
  team: string
  statusMessage?: string
  mbti?: string
}) {
  // ✅ payload를 그대로 JSON으로 보냄 (백엔드 @RequestBody로 받는 경우)
  const res = await api.post('/auth/kakao/register', payload, {
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}
