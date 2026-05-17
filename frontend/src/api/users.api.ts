import axiosInstance from './axiosInstance'
import type { UsersResponse, User } from '../types'

export const usersApi = {
  getAll: (page = 1) =>
    axiosInstance
      .get<UsersResponse>(`/users?page=${page}`)
      .then(r => r.data),

  getOne: (id: string) =>
    axiosInstance
      .get<{ success: boolean; data: { user: User } }>(`/users/${id}`)
      .then(r => r.data),

  updateRole: (id: string, role: 'admin' | 'sales') =>
    axiosInstance
      .patch<{ success: boolean; data: { user: User } }>(`/users/${id}`, { role })
      .then(r => r.data),
}