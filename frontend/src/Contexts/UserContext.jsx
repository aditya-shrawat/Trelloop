import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import { useApi } from '../../api/useApi';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const api = useApi();

    useEffect(() => {
        const fetchUserInfo = async()=>{
            try {
                const response = await api.get('/user-info');

                setUser(response.data.user)
            } catch (error) {
                console.error("User fetch error", error);
            }
        }

        fetchUserInfo()
    },[]);

  return (
    <UserContext.Provider value={{user,setUser}} >
        {children}
    </UserContext.Provider>
  )
};

export const useUser = ()=> useContext(UserContext);