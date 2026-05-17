import axiosInstance from './axiosInstance'
import type { User } from '../types'

export const authApi = {
  updateProfile: (payload: { name?: string; email?: string }) =>
    axiosInstance
      .patch<{ success: boolean; data: { user: User } }>('/auth/me', payload)
      .then(r => r.data),
}