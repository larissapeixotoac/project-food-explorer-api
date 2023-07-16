import { useContext } from 'react'
import { useParams } from 'react-router-dom'

import { ModalAddDishContext, RefreshOpenOrderContext } from '../hooks/RefreshOpenOrderContextProps'
import { addItem } from '../services/orderItem'

import receipt from '../assets/icons/receipt.svg'

interface buttonDishCardType {
    label: string, 
    isAdmin: boolean, 
    details: boolean,
    dish_id: number,
    quantity: number,
}

const AdminButton = () => {
    const params = useParams()

    function goToEditPage(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        window.location.replace(`/editdish/${params.id}`)
    }

    return (
        <button 
            className='bg-TOMATO_100 text-sm font-medium py-3 w-[19.75rem] rounded-[0.315rem] lg:w-[8.45rem]'
            onClick={goToEditPage}
        >
            Editar prato
        </button>
    )
}

export function ButtonDishCard({ label, isAdmin, details, quantity, dish_id }: buttonDishCardType) { 
    const refreshContext = useContext(RefreshOpenOrderContext)
    const modalAddDishContext = useContext(ModalAddDishContext)

    const handleSetOrder = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const body = {
            dish_id: dish_id,            
            quantity: quantity,
        }

        await addItem(body)

        refreshContext?.setRefresh(!refreshContext.refresh)
        modalAddDishContext?.setModalAddItem(true)
    }

    return (
        <>            
            {
                !isAdmin ?
                <button
                    className={` bg-TOMATO_100 font-medium w-full py-1 lg:px-6 lg:py-3
                        ${details ? ' text-[0.6rem] flex justify-center gap-3 items-center py-[0.7rem] px-6 rounded-[0.22rem] md:flex-shrink-0 lg:text-sm'
                        :
                            'rounded-[0.315rem] text-sm leading-6'
                        }
                    `}
                    onClick={handleSetOrder}
                >
                    {details &&
                        <img
                            src={receipt}
                            alt="recibo"
                            className='lg:hidden'
                        />
                    }
                    {label}
                </button>
                :
                <AdminButton 
                />
            }
        </>
    )
}