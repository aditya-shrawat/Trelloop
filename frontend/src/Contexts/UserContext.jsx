import axios from 'axios';
import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async()=>{
            try {
                const BackendURL = import.meta.env.VITE_BackendURL;
                const response = await axios.get(`${BackendURL}/user-info`,
                    {withCredentials: true}
                );

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