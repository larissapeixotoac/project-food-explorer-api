import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ImCancelCircle } from 'react-icons/im'

import { RefreshOpenOrderContext } from '../hooks/RefreshOpenOrderContextProps'
import { DisableDeleteButtonContext } from '../hooks/DisableDeleteButton'
import { fetchOpenOrderItems } from '../services/orderItem'
import { OpenOrder } from '../services/models/order'
import { fetchClosedOrder } from '../services/order'

import { PaymentOptions } from './PaymentOptions'

import pix from '../assets/icons/pix.svg'
import creditCard from '../assets/icons/creditCard.svg'
import clock from '../assets/clock.svg'
import checkCircle from '../assets/checkCircle.svg'
import forkKnife from '../assets/forkKnife.svg'

export const Payment = ({ paid }: { paid: boolean }) => {
    const [pay, setPay] = useState('pix')
    const [order, setOrder] = useState<OpenOrder[]>([])
    const [status, setStatus] = useState('pending')
    const params = useParams()
    
    const refreshContext = useContext(RefreshOpenOrderContext)
    const disableButtonContext = useContext(DisableDeleteButtonContext)

    const pixPayment = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setPay('pix')
    }

    const creditPayment = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setPay('credit')
    }  
    
    async function OpenOrder() {
        const result = await fetchOpenOrderItems()
        if(result) {     
            setOrder(result)            
        } else {
        }
    }
    
    async function OderRecord() {
        const result = await fetchClosedOrder(Number(params.id))
        if(result) {     
            setOrder(result.dishes) 
            setStatus(result.status)
        }
    }
    
    async function CatchStatus() {
        const result = await fetchClosedOrder(Number(params.id))
        setStatus(result.status)
    }

    useEffect(() => {
        if(paid) {            
            disableButtonContext?.setDisable(true)
            OderRecord()  
        }
    }, [paid])

    useEffect(() => {
        if(!paid) {            
            disableButtonContext?.setDisable(false)
            OpenOrder()     
        }
    }, [refreshContext?.refresh])

    useEffect(() => {
        const interval = setInterval(() => {
            CatchStatus()
        }, 5000)
        return () => {
        clearInterval(interval)
        }
    },[])  
 
    return (
        <div className='pl-9 pr-10'>
            <h1 className='font-medium text-[2rem] pb-8 text-LIGHT_300 leading-[2.815rem]'>
                Pagamento
            </h1>
            <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-LIGHT_600 font-ff-secundary">

                <button 
                    className={`flex items-center justify-center gap-2 border border-LIGHT_600 py-7 
                        ${pay === 'pix' && 'bg-DARK_800' }
                        ${paid && 'hidden'}
                    `}
                    onClick={pixPayment}
                >
                    <img src={pix} alt="pix" />
                    <h5>PIX</h5>
                </button>
                
                <button 
                    className={`flex items-center justify-center gap-2 border border-LIGHT_600 
                        ${pay === 'credit' && 'bg-DARK_800' }
                        ${paid && 'hidden'}
                    `}
                    onClick={creditPayment}
                >
                    <img src={creditCard} alt="Cartão de crédito" />
                    <h5>Crédito</h5>
                </button>

                <div className=' col-span-2 flex items-center justify-center'>
                    {
                        !disableButtonContext?.disable ?
                            <PaymentOptions
                                pay={pay}
                                emptyOder={order?.length > 0 ? false : true}
                            />
                        :
                            <div className='font-ff-secundary font-bold text-xl leading-8 text-LIGHT_400 py-[7.15rem]  lg:py-[3.69rem] lg:w-[33.15rem] lg:items-center'>                        
                                {
                                    status === 'pending' &&
                                    <div className='flex flex-col items-center gap-6'>
                                        <img src={clock} alt="relógio" className=' w-[6.5rem]'/>
                                        Aguardando pagamento no caixa
                                    </div>                            
                                }

                                {
                                    status === 'preparing' &&
                                    <div className='flex flex-col items-center gap-6 '>
                                        <img src={checkCircle} alt="relógio" className=''/>
                                        Pagamento aprovado!
                                    </div> 
                                }

                                {
                                    status === 'delivered' &&
                                    <div className='flex flex-col items-center gap-6'>
                                        <img src={forkKnife} alt="relógio" className=''/>
                                        Pedido entregue!
                                    </div> 
                                }

                                {
                                    status === 'canceled' &&
                                    <div className='flex flex-col items-center gap-6'>
                                        <ImCancelCircle className='w-[6.5rem] h-[6.5rem]'/>                                        
                                        Cancelado
                                    </div>                            
                                }
                            </div>   
                    }                   
                  
                </div>
            </div>
        </div>
    )
}