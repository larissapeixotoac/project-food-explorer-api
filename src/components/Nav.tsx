import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { SignOut } from '../services/auth' 
import { fetchOpenOrderItems } from '../services/orderItem'
import { ModalAddDishContext, RefreshOpenOrderContext } from '../hooks/RefreshOpenOrderContextProps'

import { Input } from './Input'

import menu from '../assets/icons/menu.svg'
import receipt from '../assets/icons/receipt.svg'
import polygon from '../assets/polygon.svg'
import signOut from '../assets/icons/signOut.svg'

export interface AdminType {
    isAdmin: boolean    
}

interface INav extends AdminType {
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    handleKeyDown: Function
}

export function Nav({ isAdmin, value, onChange, handleKeyDown }: INav) { 
    const [order, setOrder] = useState(0)
    const modalAddItemContext = useContext(ModalAddDishContext)
    const refreshContext = useContext(RefreshOpenOrderContext)

    const handleSignOut = () => {
        SignOut()
    }

    const OpenOrders = () => {
        window.location.replace('/orderconfirmation')
    }
    
    const location = useLocation()
    const goToMenu = () => {
        window.localStorage.setItem("@foodexplorer:location", location.pathname)
        window.location.replace('/menuoptions')

    }

    useEffect(() => {
        async function FetchOrder() {
            const oldOrder = order
            const result = await fetchOpenOrderItems() 
            
            if(result.length > 0) {                  
                setOrder(result.length)          
            }
            if(oldOrder > result.length) {
                setOrder(result.length)   
            }
        }
        if(!isAdmin) {
            FetchOrder()
           
        }
    },[refreshContext?.refresh])

    useEffect(() => {        
        if(modalAddItemContext?.modalAddItem) {
            const interval = setInterval(() => {
                modalAddItemContext.setModalAddItem(false)
            }, 5000)

            return () => {
                clearInterval(interval)
            }
        }

    },[modalAddItemContext?.modalAddItem])

    return (
        <div className=" bg-DARK_700 h-28 px-7 pb-6 md:h-[6.5rem] md:px-16 lg:px-20 2xl:px-32 fixed w-full z-20">
            <div className='flex items-end h-full'>
                <div className={`flex w-full lg:gap-4 xl:gap-8 items-center ${isAdmin ? ' justify-center relative' : 'justify-between'}`}>
                    
                    <button 
                        className={` lg:hidden ${isAdmin && 'absolute left-0 bottom-[0.3rem]'}`}
                        onClick={goToMenu}
                    >
                        <img
                            src={menu}
                            alt=""
                            className={` w-6 h-4 `}
                        />
                    </button>

                    <div className={`flex items-center gap-2 lg:flex-col lg:items-end lg:gap-0`}>
                        <a 
                            href='/'
                            className='flex items-center gap-2'
                        >
                            <img
                                src={polygon}
                                alt=""
                                className='w-6 h-6 lg:w-[1.9rem] lg:h-[1.9rem]'
                            />
                            <h1
                                className={`flex items-center gap-2 font-ff-secundary font-bold text-[1.35rem] leading-6 lg:text-2xl lg:flex-col lg:gap-0 lg:items-end`}
                            >
                                food explorer
                            </h1>
                        </a>

                        {
                            isAdmin &&
                            <span className='font-ff-secundary text-xs text-CAKE_200'>
                                admin
                            </span>
                        }
                    </div>

                    <div 
                        className='hidden lg:block lg:flex-grow'
                        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(event, value)}
                    >
                        <Input
                            label=''                            
                            type='text'
                            placeholder='Busque por pratos ou ingredientes'
                            icon={true}
                            value={value}
                            onChange={onChange}
                           
                        />
                    </div>

                    <a href="/favorites" className='hidden lg:block font-ff-secundary leading-[100%] text-LIGHT_300'>Meus favoritos</a>
                    <a href="/orderrecords" className='hidden lg:block font-ff-secundary leading-[100%] text-LIGHT_300'>Histórico de pedidos</a>

                    {
                        !isAdmin ?
                        <div className='relative'>
                            <button className={`relative lg:bg-TOMATO_100 lg:w-[13.5rem] lg:p-3 lg:rounded-[0.313rem] lg:flex lg:justify-center lg:gap-3 lg:items-center`}
                                onClick={OpenOrders}
                            >
                                <img
                                    src={receipt}
                                    alt=""
                                    className=' w-[1.65rem] h-[1.4rem]'
                                />
                                <h3 className='hidden lg:block lg:font-medium text-sm leading-6'>
                                        Pedidos ({order})
                                </h3>
                                <div className=' absolute -top-2 -right-2 bg-TOMATO_100 w-5 h-5 rounded-full flex items-center justify-center font-medium text-sm leading-6 lg:hidden'>
                                    {order}
                                </div>
                            </button>                                
                            <div className={`absolute -right-4 my-1 rounded-t-lg lg:w-full lg:-my-1 py-2 text-center rounded-b-lg bg-TOMATO_100 cursor-default lg:rounded-t-none lg:right-0
                                ${modalAddItemContext?.modalAddItem ? 'opacity-100 h-auto' : 'opacity-0 h-0'}
                                transition-opacity duration-900
                            `}>
                                <span className='hidden lg:block'>O pedido foi atualizado</span>
                                <span className='lg:hidden block w-[9.5rem]'>Pedido atualizado</span>
                            </div>
                        </div>                
                        :
                        <a 
                            href='/newdish'
                            className={`hidden lg:bg-TOMATO_100 lg:w-[13.5rem] lg:p-3 lg:rounded-[0.313rem] lg:flex lg:justify-center lg:gap-3 lg:items-center`}
                        >
                            <h3 className='lg:block lg:font-medium text-sm leading-6'>
                                    Novo prato
                            </h3>
                        </a>

                    }

                    <button 
                        className='hidden lg:block'
                        onClick={handleSignOut}
                    >
                        <img src={signOut} alt="sair" />
                    </button>
                </div>
            </div>
        </div>
    )
}
