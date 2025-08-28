export type ApiSuccess<T> = {
  success: true;
  code: string;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  code: string;
  message: string;
};

export type Profile = {
  id: number;
  email: string;
  nickname: string;
  team: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE' | string;
  profileImageUrl?: string;
  statusMessage?: string;
  mbti?: string;
  isActive?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PinVisibility = 'PUBLIC' | 'FRIENDS' | 'PRIVATE';

export type Pin = {
  id: number;
  userId?: number;
  lat: number;
  lng: number;
  description?: string;
  visibility: PinVisibility;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
};

export type FriendLite = {
  id: number;
  nickname: string;
  team: string;
  age?: number;
};
