import api from '../lib/axios'
import type { ApiSuccess, Profile } from '../lib/types'

export async function getMyProfile() {
  const { data } = await api.get<ApiSuccess<Profile>>('/api/users/my-profile')
  return data.data
}

export async function updateMyProfile(payload: Partial<Pick<Profile, 'nickname' | 'team' | 'statusMessage' | 'profileImageUrl' | 'mbti'>>) {
  const { data } = await api.put('/api/users/my-profile', payload)
  return data
}

export async function searchUsers(payload: { nickname?: string; team?: string; minAge?: number; maxAge?: number }) {
  const { data } = await api.post('/api/users/search', payload)
  return data
}

export async function deactivateMe() {
  const { data } = await api.patch('/api/users/my-profile/deactivate')
  return data
}

export async function adminDeactivateUser(id: number) {
  const { data } = await api.patch(`/api/users/${id}/deactivate`)
  return data
}
