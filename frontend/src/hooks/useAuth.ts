import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import type { AuthResponse, User, LeadsResponse, UsersResponse } from '../types';
import axios from 'axios';


// Current user — TanStack Query-லயே cache
export const useCurrentUser = () => {
  return useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        return response.data.data.user as User;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await axiosInstance.post<AuthResponse>('/auth/login', data);
      return res.data;
    },
    onSuccess: async (data) => {
      if (data.data?.user) {
        queryClient.setQueryData(['currentUser'], data.data.user);

        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ['leads', { page: 1 }],
            queryFn: () =>
              axiosInstance
                .get<LeadsResponse>('/leads?page=1')
                .then((r) => r.data),
          }),
          queryClient.prefetchQuery({
            queryKey: ['users', { page: 1 }],
            queryFn: () =>
              axiosInstance
                .get<UsersResponse>('/users?page=1')
                .then((r) => r.data),
          }),
        ]);

        navigate('/dashboard');
      }
    },
  });
};

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

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => axiosInstance.post('/auth/logout'),
    onSuccess: () => {
      queryClient.clear(); // All cache clear
      navigate('/login');
    },
  });
};