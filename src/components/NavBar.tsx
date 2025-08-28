import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

const linkStyle: React.CSSProperties = { padding: '10px 12px', borderRadius: 10 }
const activeStyle: React.CSSProperties = { background: 'rgba(255,255,255,.08)' }

export default function NavBar() {
  const { me, logout } = useAuth()
  const nav = useNavigate()

  return (
    <header style={{
      position:'sticky', top:0, zIndex:10,
      borderBottom:'1px solid rgba(255,255,255,.08)',
      background:'linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.15))',
      backdropFilter:'blur(6px)'
    }}>
      <div className="container" style={{ display:'flex', alignItems:'center', gap:12 }}>
        <Link to="/" style={{ fontWeight:800, letterSpacing:.5 }}>⚾🧢 크볼래</Link>
        <nav style={{ display:'flex', gap:6 }}>
          {[
            { to:'/', label:'홈' },
            { to:'/profile', label:'내 프로필' },
            { to:'/users', label:'유저 검색' },
            { to:'/pins', label:'핀' },
            { to:'/friends', label:'친구' },
          ].map(i => (
            <NavLink key={i.to} to={i.to} end={i.to==='/'}
              style={({isActive}) => ({ ...linkStyle, ...(isActive?activeStyle:{}) })}
            >{i.label}</NavLink>
          ))}
        </nav>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
          {me ? (
            <>
              <span style={{ color:'var(--muted)' }}>{me.nickname}</span>
              <button className="btn" onClick={() => { logout(); nav('/login') }}>로그아웃</button>
            </>
          ) : <Link className="btn" to="/login">로그인</Link>}
        </div>
      </div>
    </header>
  )
}
