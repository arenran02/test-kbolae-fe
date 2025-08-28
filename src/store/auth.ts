import { create } from 'zustand'
import type { Profile } from '../lib/types'

type AuthState = {
  accessToken: string | null
  me: Profile | null
  setToken: (t: string | null) => void
  setMe: (p: Profile | null) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  me: null,
  setToken: (t) => {
    if (t) localStorage.setItem('accessToken', t)
    else localStorage.removeItem('accessToken')
    set({ accessToken: t })
  },
  setMe: (p) => set({ me: p }),
  logout: () => {
    localStorage.removeItem('accessToken')
    set({ accessToken: null, me: null })
  }
}))
