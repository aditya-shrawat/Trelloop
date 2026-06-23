import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import { useApi } from '../../api/useApi';
import { useAuth } from '@clerk/clerk-react';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const api = useApi();
    const [userLoading, setUserLoading] = useState(true);
    const { isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setUserLoading(false);
      return;
    }

    let attempts = 0;
    const MAX = 10;
    let timer;

    const fetchUser = async () => {
        try {
            const response = await api.get('/user-info');
            if (response.data?.user) {
                setUser(response.data.user);
                setUserLoading(false);
                return;
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setUser(null);
                setUserLoading(false);
                return;
            }
        }

        attempts++;
        if (attempts >= MAX) {
            setUserLoading(false);
            return;
        }

        timer = setTimeout(fetchUser, 1000);
    };

    fetchUser();
    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn]);

  return (
    <UserContext.Provider value={{user,setUser, userLoading }} >
        {children}
    </UserContext.Provider>
  )
};

export const useUser = ()=> useContext(UserContext);