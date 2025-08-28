export default function Card({ children, style }: React.PropsWithChildren<{style?:React.CSSProperties}>) {
  return <div className="card" style={style}>{children}</div>
}
