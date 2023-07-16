import axios, { AxiosError } from 'axios'

import { api } from './api'

interface UserRegistration {
    name: string, 
    email: string, 
    password: string
}

export async function AccountSignUp({ name, email, password }: UserRegistration) {
    try {
        const response = await api.post('/users', { name, email, password })

        return response.data
        
    } catch(error) {
        const err = error as Error | AxiosError<Error>

        if(axios.isAxiosError(err)) {
            return err.response?.data
        } else {
             return 'Não foi possível cadastrar o usuário.'
        }
    }
}
