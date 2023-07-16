import { useEffect, useState } from 'react'

import { useAuth } from '../hooks/auth'
import { quantityOfDishes, updatePrice } from '../services/quantity&Price'

import { ButtonDishCard } from './ButtonDishCard'


import minus from '../assets/icons/minus.svg'
import plus from '../assets/icons/plus.svg'

interface IQntInput {
    details: boolean,
    price: string,
    dish_id: number
}

export const QuantityInput = ({ details, price, dish_id }: IQntInput) => {
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)
    const [quantity, setQuantity] = useState(1)
    const [newPrice, setNewPrice] = useState('')

    const [detailsAdminPage, setDetailsAdminPage] = useState(() => {
        let result
        if((user?.isAdmin === '0' ? false : true) && details) {
            result = true 
        } else {
            result = false
        }
        return result
    })

    const handleQuantityOfDishes = (operator: string) => {
        const result = quantityOfDishes(operator, quantity)
        if(result) {
            setQuantity(result)
        }
    }

    useEffect(() => {
        if(price) {
            const result = updatePrice(quantity, Number(price))
            setNewPrice(result)  
        }
    }, [quantity, price])
    
    return (
        <div className={`flex justify-center gap-4 md:w-80 md:mx-auto md:gap-6 lg:mx-0 lg:justify-between lg:w-72 lg:gap-8
            ${detailsAdminPage && ' justify-center'}
        `}>
            <div className={`flex items-center gap-[0.88rem] 
                ${(user?.isAdmin === '0' ? false : true) && 'hidden'} 
                ${details && 'gap-4'}
            `}>
                <button
                    onClick={() => handleQuantityOfDishes('minus')}
                    className=' h-full'
                >
                    <img 
                        src={minus} 
                        alt="menus" 
                        className={`${details && 'w-5 xl:w-[1.15rem]'}`}
                    />
                </button>
                <span className={` font-ff-secundary text-LIGHT_300 md:text-xl md:font-semibold ${details && ' text-[1.4rem] lg:text-xl'}`}>
                    {quantity < 10 ? `0${quantity}` : String(quantity)}
                </span>
                <button
                    onClick={() => handleQuantityOfDishes('plus')}
                >
                    <img 
                        src={plus} 
                        alt="mais" 
                        className={`${details && 'w-5 xl:w-[1.15rem]'}`}
                    />
                </button>
            </div>

            <div className={`${(user?.isAdmin === '0' ? false : true) ? '': 'lg:flex-grow'}`}>
                <ButtonDishCard
                    label={`pedir ∙ ${newPrice}`}
                    isAdmin={user?.isAdmin === '0' ? false : true}
                    details={details}
                    dish_id={dish_id}
                    quantity={quantity} 
                />
            </div>
        </div>
    )
}