import { useContext, useEffect, useState } from 'react'

import { DisableDeleteButtonContext } from '../hooks/DisableDeleteButton'
import { RefreshOpenOrderContext } from '../hooks/RefreshOpenOrderContextProps'
import { RemoveFavorite } from '../services/favorites'
import { deleteOrderDish } from '../services/orderItem'
import { Dish } from '../services/models/IDish'
import { fetchDish } from '../services/restaurant'
import { updatePrice } from '../services/quantity&Price'

import { Meals } from './Meals'
import { ScreenWidth } from './ScreenWidth'
import { api } from '../services/api'
import { Drinks } from './Drinks'
import { Desserts } from './Desserts'

interface IOrderItem {
    order_id: number,
    favorite:boolean,
    dish_id:number,
    quantity: number,
    FetchFavorites: Function,
    order: boolean
}

export const OrderItem = (props: IOrderItem) => {
    const refreshContext = useContext(RefreshOpenOrderContext)
    const disableButton = useContext(DisableDeleteButtonContext)
    const minScreenSize = 1024
    const [imagePlaceHolder, setImagePlaceHodler] = useState('')
    const [dish, setDish] = useState<Dish>()
    const [price, setPrice] = useState('')

    const dishImage = dish?.image ? `${api.defaults.baseURL}/files/${dish.image}` :  imagePlaceHolder

    const meal = Meals()
    const drink = Drinks()
    const desserts = Desserts()

    async function handleRemoveFavoriteDish(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        const result = await RemoveFavorite(props.dish_id)
        if(result === 'Desfavoritado.') {
            props.FetchFavorites()
        }
    }

    async function handleDishOrder(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        
        if(disableButton?.disable === true) {
            return
        }

        if(disableButton?.disable === false) {
            await deleteOrderDish(props.dish_id)
            refreshContext?.setRefresh(!refreshContext.refresh)
        }
    }

    useEffect(() => {
        async function dishInfo() {
            const result = await fetchDish(props.dish_id)
            setDish(result)
        }
        dishInfo()
    },[props.dish_id])

    useEffect(() => {       
        if(!dish?.image) {
            if(dish?.category === "meal") {
                setImagePlaceHodler(meal.spaguettiGambe)
            }
            if(dish?.category  === "drink") {
                setImagePlaceHodler(drink.tea)
            }
            if(dish?.category  === "dessert") {
                setImagePlaceHodler(desserts.macarons)
            }
        }

        if(dish?.price) {
            const result = updatePrice(props.quantity, Number(dish.price))
            setPrice(result)  
        }
    },[dish])

    return (
        <div className={`flex items-center justify-start py-4 w-full gap-3 line-clamp-1
            ${props.order && 'lg:w-full lg:justify-start lg:gap-[0.815rem]'} 
        `}>
            <a href={`/dishdetails/${props.dish_id}`}>
                <img
                    src={dishImage}
                    alt=""
                    className=' w-[4.5rem] h-[4.5rem] rounded-[50%] '
                />
            </a>

            <div className={`w-[9.13rem]
                ${props.order && ' flex flex-col justify-start gap-1 lg:w-[75%] '}
            `}>
                <a className={` font-medium lg:text-xl text-LIGHT_300 
                    ${props.favorite && 'w-full truncate' }
                `}
                    href={`/dishdetails/${props.dish_id}`}
                >
                    {
                        ScreenWidth() >= minScreenSize && !props.favorite ?
                            <div className='lg:flex lg:items-center lg:gap-[0.65rem]'>
                                {`${props.quantity} x ${dish?.dish_name}`}
                                <span className=' font-ff-secundary text-xs text-LIGHT_400'>
                                    {price}
                                </span>                                
                            </div>
                        :
                            <button 
                                className='text-left whitespace-normal'
                                onClick={() => {window.location.replace(`/dishdetails/${dish?.id}`)
                            }}>
                                {dish?.dish_name}
                            </button>
                    }                    
                </a>
                
                <button className={` font-ff-secundary text-xs text-TOMATO_400
                    ${props.order && ' text-left'}
                `}
                    onClick={
                        props.favorite ?
                        handleRemoveFavoriteDish
                        :
                        handleDishOrder
                    }
                >
                    {
                        !props.favorite ?
                            'Excluir'
                        :
                            'Remover dos favoritos'
                    }
                </button>
            </div>
        </div>
    )
}