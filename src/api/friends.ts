import api from '../lib/axios'

export async function sendFriendRequest(senderId: number, receiverId: number) {
  const { data } = await api.post('/api/friends/request', { senderId, receiverId })
  return data
}

export async function reportFriend(senderId: number, receiverId: number) {
  const { data } = await api.post('/api/friends/report', { senderId, receiverId })
  return data
}

export async function rejectFriend(senderId: number, receiverId: number) {
  const { data } = await api.post('/api/friends/reject', { senderId, receiverId })
  return data
}

export async function acceptFriend(senderId: number, receiverId: number) {
  const { data } = await api.post('/api/friends/accept', { senderId, receiverId })
  return data
}

export async function getFriends(userId: number) {
  const { data } = await api.get('/api/friends', { params: { userId } })
  return data
}

export async function getPendingRequests(userId: number) {
  const { data } = await api.get('/api/friends/requests', { params: { userId } })
  return data
}

export async function deleteFriend(userId: number, friendId: number) {
  const { data } = await api.delete(`/api/friends/${friendId}`, { params: { userId } })
  return data
}
