import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import type { AuthResponse, User, LeadsResponse, UsersResponse } from '../types';
import axios from 'axios';
import { setToken, clearToken } from '../api/axiosInstance'


// Current user — TanStack Query-லயே cache
export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me')
      // Refresh token-லிருந்து new access token வந்தா set பண்ணு
      if (res.data.data?.accessToken) {
        setToken(res.data.data.accessToken)
      }
      return res.data.data.user
    },
    staleTime: Infinity,
    retry: false,
  })
}

export const useLogin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await axiosInstance.post<AuthResponse>('/auth/login', data)
      return res.data
    },
    onSuccess: async (data) => {
      if (data.data?.accessToken) {
        setToken(data.data.accessToken) // ← memory-ல save
      }
      if (data.data?.user) {
        queryClient.setQueryData(['currentUser'], data.data.user)
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ['leads', { page: 1 }],
            queryFn: () => axiosInstance.get('/leads?page=1').then(r => r.data),
          }),
          queryClient.prefetchQuery({
            queryKey: ['users', { page: 1 }],
            queryFn: () => axiosInstance.get('/users?page=1').then(r => r.data),
          }),
        ])
        navigate('/dashboard')
      }
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => axiosInstance.post('/auth/logout'),
    onSuccess: () => {
      clearToken() 
      queryClient.clear()
      navigate('/login')
    },
  })
}

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => {
      const res = await axiosInstance.post<AuthResponse>(
        '/auth/register',
        data
      );
      return res.data;
    },
    onSuccess: () => {
      // No cookie set — just navigate to login
      navigate('/login');
    },
  });
};

// export const useLogout = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: () => axiosInstance.post('/auth/logout'),
//     onSuccess: () => {
//       queryClient.clear(); // All cache clear
//       navigate('/login');
//     },
//   });
// };