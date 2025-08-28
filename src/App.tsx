import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

export default function App() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>로딩 중…</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
