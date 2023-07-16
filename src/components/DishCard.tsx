import React, { useEffect, useState } from 'react'

import { api } from '../services/api'
import { useAuth } from '../hooks/auth'
import { FavoriteDish, RemoveFavorite, ShowFavorite } from '../services/favorites'
import { quantityOfDishes, updatePrice } from '../services/quantity&Price'
import { Dish } from "../services/models/IDish"

import { ButtonDishCard } from './ButtonDishCard'

import { Meals } from './Meals'
import { Drinks } from './Drinks'
import { Desserts } from './Desserts'

import minus from '../assets/icons/minus.svg'
import plus from '../assets/icons/plus.svg'
import pencil from '../assets/icons/pencil.svg'
import heart from '../assets/icons/heart.svg'
import fullHeart from '../assets/icons/fullHeart.svg'

export function DishCard({ dish }: { dish: Dish }) {
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)
    const [favorites, setFavorites] = useState(false)
    const [isFavorites, setIsFavorites] = useState(heart)
    const [quantity, setQuantity] = useState(1)
    const [newPrice, setNewPrice] = useState('')
    const [imagePlaceHolder, setImagePlaceHodler] = useState('')

    const meal = Meals()
    const drink = Drinks()
    const desserts = Desserts()

    const dishImage = dish.image ? `${api.defaults.baseURL}/files/${dish.image}` :  imagePlaceHolder
    const handleEditButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        window.location.replace(`/editdish/${dish.id}`)
    }

    async function handleFavoriteButton(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if(isFavorites === heart) {
            const response = await FavoriteDish(dish.id, user?.id)
            if(response === "Favoritado!") {
                setFavorites(true)
            }            
        }

        if(isFavorites === fullHeart) {
            const response = await RemoveFavorite(dish.id)            
            if(response === "Desfavoritado.") {
                setFavorites(false)
            }  
        }
    }

    const handleQuantityOfDishes = (operator: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const result = quantityOfDishes(operator, quantity)
        if(result) {
            setQuantity(result)
        }
    }
    
    useEffect(() => {        
        async function fetchFavorite() {
            const response = await ShowFavorite(dish.id)        
            if(response.user_id === user?.id) {
                setFavorites(true)
            }
        }
        fetchFavorite()
        if(!dish.image) {
            if(dish.category === "meal") {
                setImagePlaceHodler(meal.spaguettiGambe)
            }
            if(dish.category === "drink") {
                setImagePlaceHodler(drink.tea)
            }
            if(dish.category === "dessert") {
                setImagePlaceHodler(desserts.macarons)
            }
        }
    }, [])

    useEffect(() => {
        if(favorites) {
            setIsFavorites(fullHeart)
        }
        if(!favorites) {
            setIsFavorites(heart)
        }
    }, [favorites])    

    useEffect(() => {
        if(dish.price) {
            const result = updatePrice(quantity, Number(dish.price))
            setNewPrice(result)  
        }
    }, [quantity, dish.price])
    

    return (
        <div         
            className={` w-[13.15rem] flex flex-col mr-4 bg-DARK_200 border rounded-lg border-DARK_300 relative md:w-64 lg:w-[19rem] lg:h-[30rem]            
            ${(user?.isAdmin === '0' ? false : true) ? 'py-14 px-6 h-[19.4rem]' : 'p-6 h-80'}`}            
        >
            <button 
                onClick={(user?.isAdmin === '0' ? false : true) ? handleEditButton : handleFavoriteButton}
                className='absolute top-4 right-4 z-50'
            >
                <img 
                    src={(user?.isAdmin === '0' ? false : true) ? pencil : isFavorites} 
                    alt={(user?.isAdmin === '0' ? false : true) ? 'editar' : 'coração'}
                />
            </button>

            <div className='w-full h-full flex flex-col items-center justify-center lg:gap-4'>
                <a href={`/dishdetails/${dish.id}`}>
                    <img
                        src={dishImage}
                        alt=""
                        className=' w-[5.5rem] h-[5.5rem] mb-3 md:w-32 md:h-32 lg:w-44 lg:h-44 rounded-[50%] '
                    />
                </a>
                <a href={`/dishdetails/${dish.id}`} className='text-center text-sm leading-6 text-LIGHT_300 mb-3 md:text-lg lg:font-semibold lg:text-2xl line-clamp-2'>
                    {dish?.dish_name}    
                </a>
                
                <div className='hidden md:block font-ff-secundary text-sm text-LIGHT_400 font-light text-center w-full'>
                    <p className='hidden truncate'>
                        {dish.description}
                    </p>
                </div>
                
                <p className=' font-ff-secundary text-CAKE_200 mb-3 text-lg lg:text-[2rem] lg:leading-[3.2rem]'>
                    {newPrice}                    
                </p>

                <div className={`${(user?.isAdmin === '0' ? false : true) ? 'hidden' : 'flex flex-col gap-4 w-full lg:flex-row'}`}>
                    <div className='flex justify-center'>
                        <div className={`py-1 flex items-center gap-[0.88rem] `}>
                            <button 
                                className=' h-full'
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleQuantityOfDishes('minus', event)}
                            >
                                <img src={minus} alt="menus" />
                            </button>
                            <span className=' font-ff-secundary text-LIGHT_300 md:text-xl md:font-semibold'>
                                {quantity < 10 ? String(`0${quantity}`) : String(quantity)}
                            </span>
                            <button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleQuantityOfDishes('plus', event)}>
                                <img src={plus} alt="mais" />
                            </button>
                        </div>
                    </div>

                    <div className='flex-grow'>
                        <ButtonDishCard
                            label='incluir'
                            isAdmin={user?.isAdmin === '0' ? false : true}
                            details={false}
                            dish_id={dish.id}
                            quantity={quantity}
                        />
                    </div>
                </div>
                
            </div>
        </div>
    )
}