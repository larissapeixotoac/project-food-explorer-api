import axios, { AxiosError } from "axios";
import { api } from "./api";

export async function PayOrder(order_id: number, status: string) {
    try {
        const info = {
            id: order_id,
            status
        }
        const response = await api.put(`/payment`, info)
    
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