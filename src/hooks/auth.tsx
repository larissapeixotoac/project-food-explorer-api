import React, { createContext, useContext, useState, useEffect } from 'react'

import { api } from '../services/api'
import { User } from '../services/models/user'

type IAuthContext = {
    user?: User
}

type IAuthContextProvider = {
    children: React.ReactNode
}

const AuthContext = createContext({} as IAuthContext)

const AuthContextProvider = ({ children }: IAuthContextProvider) => {
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const token = localStorage.getItem("@foodexplorer:token")
        const user = localStorage.getItem("@foodexplorer:user")

        if(token && user) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            setUser(JSON.parse(user))
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{user}}
        >            
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    
    return context
}

export {
    AuthContextProvider,
    useAuth
}