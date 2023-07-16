import { useEffect, useState } from 'react'

import { showOrders } from '../services/order'

import { OrderCard, PcOrderCards } from './OrderCard'
import { ScreenWidth } from './ScreenWidth'
import { AdminType } from './Nav'
import { IOrders } from '../services/models/order'


export const OrderEntry = ({ isAdmin }: AdminType) => {    
    const [orders, setOrders] = useState<IOrders[]>()
    // const [state, setState] = useState(false) 

    useEffect(() => {
        async function ClosedOrder() {
            const result = await showOrders()
            if(result) {
                setOrders(result)   
            }  
        }
        ClosedOrder()
    },[])   

    return (
        <div>
            {
                ScreenWidth() < 1024 ?
                <div className="flex flex-col gap-[1.064rem]">
                    {
                        orders &&
                        orders.map(order => (
                            order.status !== 'open' &&
                            <OrderCard
                                key={order.id}                                        
                                isAdmin={isAdmin}
                                order={order}
                            />
                        ))                                
                    }                    
                </div>
                :
                <div className='border-2 border-DARK_MIL rounded-t-lg w-full'>
                    <table className=' w-full'>
                        <thead className='border-b-2 border-DARK_MIL'>
                            <tr className=' font-ff-secundary font-bold text-LIGHT_300 text-sm leading-[160%]'>
                                <th className={`px-6 py-[1.313rem] text-left border-r-2 border-DARK_MIL ${ isAdmin ? ' w-56' : 'w-[9.439rem]'}`}>
                                    Status
                                </th>
                                <th className='px-6 py-[1.313rem] text-left border-r-2 border-DARK_MIL w-[9.439rem]'>
                                    Código
                                </th>
                                <th className='px-6 py-[1.313rem] text-left border-r-2 border-DARK_MIL'>
                                    Detalhamento
                                </th>
                                <th className='px-6 py-[1.313rem] text-left w-[9.439rem]'>
                                    Data e hora
                                </th>
                            </tr>
                        </thead>

                        <tbody className=' font-ff-secundary text-sm leading-[160%] text-LIGHT_400'>
                            {
                                orders &&
                                orders.map(order => (
                                    order.status !== 'open' &&
                                    <PcOrderCards
                                        key={order.id}                                        
                                        isAdmin={isAdmin}
                                        order={order}
                                    />
                                ))                                
                            }
                            
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}