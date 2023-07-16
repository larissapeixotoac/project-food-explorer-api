import React, { useContext, useEffect, useState } from 'react'

import { Input } from './Input'
import { ScreenWidth } from '../components/ScreenWidth'


import qrcode from '../assets/QRcode.svg'
import receipt from '../assets/icons/receipt.svg'
import { finalizeOrder } from '../services/order'
import { Modal } from './Modal'

import close from '../assets/icons/close.svg'
import { RefreshOpenOrderContext } from '../hooks/RefreshOpenOrderContextProps'

interface IPayment  { 
    pay: string,
    emptyOder: boolean|undefined
}

export const PaymentOptions = ({ pay, emptyOder  }: IPayment) => {
    const [card, setCard] = useState('')
    const [validity, setValidity] = useState('')
    const [CVV, setCVV] = useState('')
    const [msg, setMsg] = useState('test')
    const [modalState, setModalState] = useState(false)

    const screenWidth = ScreenWidth()
    const maxScreenSize = 1024

    async function handleFinalizeOrder(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        const cleanedNumber = card.replace(/\D/g, '');
        if(cleanedNumber.length < 16 || cleanedNumber.length > 16) {
            setMsg('Número do cartão inválido')
            return 
        }

        const rightFormat = validity.split('/')

        if(rightFormat.length < 2) {
            setMsg('O número da validade não é válido')
            return 
        }

        const currentDate = new Date()
        const year = currentDate.getFullYear()
        
        const cardYear = Number(`20${rightFormat[1]}`)
        if(cardYear < year) {
            setMsg('O cartão está vencido')
            return 
        }
        
        const month = currentDate.getMonth()

        if(cardYear === year && Number(rightFormat[0]) < month) {
            setMsg('O cartão está vencido')
            return 
        }
        if(CVV.length < 3 || CVV.length > 3) {
            setMsg('Código de segurança inválido')
            return 
        }

        if(!emptyOder) {
            const result = await finalizeOrder()

            if(result) {
                setMsg(result)
            }
            setCVV('')
            setCard('')
            setValidity('')                      
               
            if(screenWidth < maxScreenSize) {
                window.location.replace('/orderconfirmation')
            }
        } else {
            setMsg('O pedido está vazio')
        }
    }

    function handleModalState() {
        const newState = !modalState
        setModalState(newState) 

        if(newState === false) {
            if(msg === 'Pedido feito, aguardando confirmação do pagamento.') {
                window.location.replace('/')
            }
            setMsg('')  
        }
    }

    useEffect(() => {
        if(msg.length > 0 && msg !== 'test') {
            handleModalState()
        }
    },[msg])

    useEffect(() => { 
        if(card.length === 5 || card.length === 10 || card.length === 15) {
            const cleanedNumber = card.replace(/\D/g, '');
                if(cleanedNumber.length === 0) {
                    setMsg("O número do cartão é inválido")                
                }
            const groups = cleanedNumber.match(/.{1,4}/g)
            const formatteNumber = groups ? groups.join(' ') : ''
            setCard(formatteNumber)
        }  
    }, [card])

    return (
        <div className='lg:w-[33.15rem]'>
            {
                pay === 'pix' ?
                    <img
                        src={qrcode}
                        alt="QRcode"
                        className='py-8 px-[5.4rem] lg:px-[8.13rem]'
                    />
                :
                    <div className={` py-[3.6rem] px-[1.65rem] lg:pt-[3.7rem] lg:px-[5.69rem] `}>
                        <form typeof='submit'>
                            <div className='flex flex-col gap-[2.315rem]'>
                                <Input
                                    label='Credit-Card'
                                    type='text'
                                    placeholder='0000 0000 0000 0000'
                                    icon={false}
                                    value={card}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCard(event.target.value)}
                                />
                                <div className='flex gap-[1.07rem]'>
                                    <Input
                                        label='Validade'
                                        type='text'
                                        placeholder='04/25'
                                        icon={false}
                                        value={validity}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValidity(event.target.value)}
                                    />
                                    <Input
                                        label='CVC'
                                        type='number'
                                        placeholder='000'
                                        icon={false}
                                        value={CVV}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCVV(event.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className='flex mt-[2.315rem]'>
                            <button className='flex-grow py-3 px-[4.88rem] rounded-[0.315rem] font-medium text-sm leading-6 bg-TOMATO_100 lg:flex lg:items-center lg:justify-center lg:gap-2'
                                onClick={handleFinalizeOrder}
                                typeof='submit'
                            >
                                <img
                                    src={receipt}
                                    alt="recibo"
                                    className='hidden lg:block'
                                />
                                Finalizar pagamento
                            </button>
                        </div>

                        <div className={`absolute inset-0 items-center justify-center backdrop-filter-none bg-opacity-100 ${modalState ? 'flex -top-1/3' : 'hidden'}`}>
                            <div className='relative'>
                                <Modal
                                    message={msg}
                                />
                                <button
                                    className='absolute top-3 right-3 w-3'
                                    onClick={handleModalState}
                                >
                                    <img src={close} alt="fechar" />
                                </button>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}