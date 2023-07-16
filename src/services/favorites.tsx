import axios, { AxiosError } from 'axios'
import { api } from './api'

export async function FavoriteDish(dish_id: any, user_id: any) {
    try {
        const props = {
            dish_id,
            user_id
        }
        const response = await api.post('/favorites', props)

        return response.data
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return 'Não foi possível favoritar.'
        }
    }
}

export async function RemoveFavorite(dish_id: any) {
    try {
        const response = await api.delete(`/favorites/${dish_id}`)

        return response.data
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return 'Não foi possível desfavoritar.'
        }
    }
}

export async function ShowFavorite(dish_id: any) {
    try {
        const response = await api.get(`/favorites/${dish_id}`)
        return response.data
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return 'Não foi possível pegar essa informação.'
        }
    }
}

export async function Index(user_id: any){
    try {
        const response = await api.get(`/favorites?user_id=${user_id}`)
        response.data
        return response.data
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return 'Não foi possível pegar essa informação.'
        }
    }
}