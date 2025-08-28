export default function Login() {
  const REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI

  const kakaoLogin = () => {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_KEY}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=${crypto.randomUUID()}`
    window.location.href = url
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>⚾🧢 크볼래 로그인</h1>
      <p>카카오로 로그인해 주세요.</p>
      <button onClick={kakaoLogin} style={{ padding: '8px 12px' }}>
        카카오로 로그인
      </button>
    </div>
  )
}
