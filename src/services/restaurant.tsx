import axios, { AxiosError } from 'axios'

import { api } from './api'
import { SignOut } from './auth'

interface UpdatedDish { 
    dish_name: string, 
    category: string, 
    price: string|number, 
    description: string,
    ingredients: string[]
}

export async function createDish(props: UpdatedDish) {
    try {
        const response = await api.post('/restaurant', props)        
        return response.data
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return 'Não foi possível criar o novo prato.'
        }
    }
}

export async function fetchDish(id: string|number|undefined) {    
    try {
        const response = await api.get(`/restaurant/${id}`)
        return response.data
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            if(err.response?.data === 'JWT Token inválido.') {
                SignOut()
            }
        return err.response?.data
        }
    }
}

export async function fetchDishes(search: string) {
    try {
        const response = await api.get(`/restaurant?name=${search}&ingredients=${search}`)
        return response.data     
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            if(err.response?.data === 'JWT Token inválido.') {
                SignOut()
            }
        return err.response?.data
        }
    }
}

export async function updateImage(currentImage: File, id: string) {
    try {
        if(currentImage) {
            const file = new FormData()
            file.append('image', currentImage)
            file.append('dish_id', id)
            const response = await api.patch('/restaurant/image', file)
            return response.data
        }
        
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return 'Não foi possível salvar as alterações.'
        }
    }
}

export async function updateDish(props: UpdatedDish, id: string) {    
    try {
        const response = await api.put(`/restaurant/${id}`, props)
        return response.data
        
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return 'Não foi possível salvar as alterações.'
        }
    }
}

export async function deleteDish(id: string) {
    try {
       const response = await api.delete(`/restaurant/${id}`)
    
        return response.data

    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return 'Não foi possível salvar as alterações.'
        }
    }
}

