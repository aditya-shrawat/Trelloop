import axios from 'axios';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useMemo } from 'react';

export const useApi = () => {
  const { getToken } = useAuth();
  const { redirectToSignIn } = useClerk();
  
  const api = useMemo(() => {
    const BackendURL = import.meta.env.VITE_BackendURL;

    const apiInstance = axios.create({
      baseURL: BackendURL,
      withCredentials: true,
    });

    // request interceptor to automatically add token
    apiInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        } catch (error) {
          console.error('Failed to get token:', error);
          return Promise.reject(error);
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Error handling
    apiInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Unauthorized access - token may be expired');
          redirectToSignIn({signInUrl: '/user/signin'});
        }
        return Promise.reject(error);
      }
    );

    return apiInstance;
  }, [getToken,redirectToSignIn]);

  return api;
};
