import axios, { AxiosError } from "axios"
import { api } from "./api"

export async function finalizeOrder() {
    try {
        const response = await api.put('/orders')
        return response.data
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return 'Não foi possível adicionar o prato no pedido.'
        }
    }
}

export async function showOrders() {
    try {
        const response = await api.get('/orders')
        return response.data
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return ''
        }
    }
}

export async function updateClosedOrder(id: number) {
    try {
        const response = await api.put(`/orders/${id}`)

        return response.data
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return 'Não foi possível atualizar o pedido.'
        }
    }
}

export async function fetchClosedOrder(id: number) {
    try {
        const response = await api.get(`/orders/${id}`)
        return response.data
    } catch(error) {                
        const err = error as Error | AxiosError<Error>
        if(axios.isAxiosError(err)) {      
            return err.response?.data
        } else {
            return ''
        }
    }    
}

