import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users.api'

export const USERS_KEY = 'users'

export const useUsers = (page = 1) => {
  return useQuery({
    queryKey: [USERS_KEY, page],
    queryFn: () => usersApi.getAll(page),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })
}

export const useUpdateUserRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'admin' | 'sales' }) =>
      usersApi.updateRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  })
}