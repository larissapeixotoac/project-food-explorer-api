import axios, { AxiosError } from 'axios'

import { api } from './api'
import { User } from './models/user'
import { Admin } from './models/admin'

export async function signIn(email: string, password: string) {
    try {
        if(email.length === 0 || password.length === 0) {
            return 'Preencha todos os campos.'
        }

        const response = await api.post('/sessions', {email, password})
        const { user, token, admin }: { user: User, token: string, admin: Admin } = response.data

        localStorage.setItem("@foodexplorer:token", token)
        
        if(user) {
            localStorage.setItem("@foodexplorer:user", JSON.stringify(user))
        } else {
            localStorage.setItem("@foodexplorer:user", JSON.stringify(admin))
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        window.location.replace('/')
        
    } catch(error) {
        const err = error as Error | AxiosError<Error>

        if(axios.isAxiosError(err)) {            
            return err.response?.data
        } else {
            return 'Não foi possível entrar.'
        }
    }
}

export function SignOut() {
    localStorage.removeItem("@foodexplorer:user")
    localStorage.removeItem("@foodexplorer:token")
    window.location.replace('/')
}
