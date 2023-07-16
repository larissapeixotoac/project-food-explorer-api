import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { RefreshOpenOrderContext } from '../hooks/RefreshOpenOrderContextProps'
import { DisableDeleteButtonContext } from '../hooks/DisableDeleteButton'
import { OpenOrder } from '../services/models/order'
import { updatePrice } from '../services/quantity&Price'
import { fetchOpenOrderItems } from '../services/orderItem'
import { fetchClosedOrder } from '../services/order'

import { OrderItem } from '../components/OrderItem'

export const OrderList = ({ open }: { open: boolean } ) => {
    const [total, setTotal] = useState('')
    const [order, setOrder] = useState<OpenOrder[]>()
    const refreshContext = useContext(RefreshOpenOrderContext)
    const disableDeleteButton = useContext(DisableDeleteButtonContext)
    const params = useParams()

    const totalPrice = () => {    
        if(order)     {
            const total = order.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
            return total       
        }
        return 0
    }

    const sendOrderInfo = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault() 
        window.location.replace(`/paymentpage/${params.id}`)
    }
    
    async function OpenOrder() {
        const result = await fetchOpenOrderItems()
        if(result) {     
            setOrder(result)            
        }
    }

    async function OrderRecord() {
        const result = await fetchClosedOrder(Number(params.id))
        if(result) {     
            setOrder(result.dishes) 
            disableDeleteButton?.setDisable(true)
        }
    }

    useEffect(() => {
        if(!open) {
            OrderRecord()     
        }
    }, [])

    useEffect(() => {
        const total = totalPrice()
        const result = updatePrice(1, total)
        setTotal(result)
    }, [order])


    useEffect(() => {
        if(open) {
            OpenOrder()     
        }
    }, [refreshContext?.refresh])

    return (
        <div className='mx-auto w-full pl-[2.19rem] pb-14 flex-grow'>
            <h1 className=' font-medium w-full text-[2rem] pb-[1.75rem] leading-[2.815rem] text-LIGHT_300'>
                Meu pedido
            </h1>
            {
                order &&
                order.map(dish => (
                    <OrderItem
                        key={dish.id}
                        order_id={dish.id}
                        favorite={false}
                        dish_id={dish.dish_id}                        
                        quantity={dish.quantity}
                        FetchFavorites={ () => {}}
                        order={true}
                    />
                ))
            }            

            <p className=' pt-4 pb-12 font-medium text-xl text-LIGHT_300'>
                Total: {total}
            </p>

            
            <div className='flex justify-end lg:hidden'>
                <button className='py-3 px-[4.88rem] rounded-[0.315rem] font-medium text-sm leading-6 bg-TOMATO_100'
                    onClick={sendOrderInfo}
                >
                    Avançar
                </button>
            </div>      
        </div>
    )
}