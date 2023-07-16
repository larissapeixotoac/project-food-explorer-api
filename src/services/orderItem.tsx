import { api } from "./api"
import axios, { AxiosError } from "axios"

interface Order {
    dish_id: number,
    quantity: number
}

export async function addItem(props: Order) {
    try {
        const response = await api.post('/orderitems', props)
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

export async function fetchOpenOrderItems() {
    try {
        const response = await api.get('/orderitems')
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

export async function deleteOrderDish(dish_id: number) {
    try {
        const response = await api.delete(`/orderitems?dish_id=${dish_id}`)
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