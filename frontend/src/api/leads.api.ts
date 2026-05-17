import axiosInstance from './axiosInstance'
import type { LeadsResponse, Lead } from '../types'

export interface LeadFilters {
  page?: number
  status?: string
  source?: string
  search?: string
  sort?: 'latest' | 'oldest'
  limit?: number
}

export interface CreateLeadPayload {
  name: string
  email: string
  phone?: string
  status?: string
  source: string
  notes?: string
  assignedTo?: string
}

export interface UpdateLeadPayload extends Partial<CreateLeadPayload> {}

export const leadsApi = {
  getAll: (filters: LeadFilters = {}) => {
    const params = new URLSearchParams()
    if (filters.page) params.set('page', String(filters.page))
    if (filters.status) params.set('status', filters.status)
    if (filters.source) params.set('source', filters.source)
    if (filters.search) params.set('search', filters.search)
    if (filters.sort) params.set('sort', filters.sort)
    return axiosInstance
      .get<LeadsResponse>(`/leads?${params.toString()}`)
      .then(r => r.data)
  },

  getOne: (id: string) =>
    axiosInstance.get<{ success: boolean; data: { lead: Lead } }>(`/leads/${id}`).then(r => r.data),

  create: (payload: CreateLeadPayload) =>
    axiosInstance.post<{ success: boolean; data: { lead: Lead } }>('/leads', payload).then(r => r.data),

  update: (id: string, payload: UpdateLeadPayload) =>
    axiosInstance.put<{ success: boolean; data: { lead: Lead } }>(`/leads/${id}`, payload).then(r => r.data),

  delete: (id: string) =>
    axiosInstance.delete<{ success: boolean; message: string }>(`/leads/${id}`).then(r => r.data),

  exportCSV: (filters: Omit<LeadFilters, 'page'> = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.source) params.set('source', filters.source)
    if (filters.search) params.set('search', filters.search)
    return axiosInstance
      .get(`/leads/export/csv?${params.toString()}`, { responseType: 'blob' })
      .then(r => {
        const url = window.URL.createObjectURL(new Blob([r.data]))
        const a = document.createElement('a')
        a.href = url
        a.download = `leads_${Date.now()}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      })
  },
}