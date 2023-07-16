import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { api } from '../services/api'
import { DataIngredients, Dish } from '../services/models/IDish'
import { fetchDish } from '../services/restaurant'
import { FavoriteDish, RemoveFavorite, ShowFavorite } from '../services/favorites'
import { useAuth } from '../hooks/auth'
import { ModalAddDishContext, RefreshOpenOrderContext } from '../hooks/RefreshOpenOrderContextProps'

import { Nav } from '../components/Nav'
import { TextButton } from '../components/TextButton'
import { Meals } from '../components/Meals'
import { Drinks } from '../components/Drinks'
import { Desserts } from '../components/Desserts'
import { Tag } from '../components/Tag'
import { QuantityInput } from '../components/QuantityInput'
import { Footer } from '../components/Footer'
import { handleKeyDown } from '../components/HandleSearchKeyDown'

import heart from '../assets/icons/heart.svg'
import fullHeart from '../assets/icons/fullHeart.svg'

interface IFavButton {
    onClick: React.MouseEventHandler<HTMLButtonElement>, 
    isFavorite: string
}

const FavoriteButton = (props: IFavButton) => {
    return (
        <button 
            onClick={props.onClick}
            className=' top-4 right-4'
        >
            <img 
                src={props.isFavorite} 
                alt={'coração'}
            />
        </button>
    )
}

export const DishDetails = () => {    
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)
    const [search, setSearch] = useState('')
    const [dish, setDish] = useState({} as Dish)
    const [ingredients, setIngredients] = useState<DataIngredients[]>([])
    const [favorite, setFavorite] = useState(false)
    const [isFavorite, setIsFavorite] = useState(heart)
    const [imagePlaceHolder, setImagePlaceHodler] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [modalAddItem, setModalAddItem] = useState(false)

    const dishImage = dish.image ? `${api.defaults.baseURL}/files/${dish.image}` :  imagePlaceHolder
    
    const params = useParams()

    const meal = Meals()
    const drink = Drinks()
    const desserts = Desserts()

    async function handleFavoriteButton(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if(isFavorite === heart) {
            const response = await FavoriteDish(dish.id, user?.id)
            if(response === "Favoritado!") {
                setFavorite(true)
            }          
        }

        if(isFavorite === fullHeart) {
            const response = await RemoveFavorite(dish.id)
            
            if(response === "Desfavoritado.") {
                setFavorite(false)
            }  
        }
    }
    
    useEffect(() => {      
        async function CurrentDish() {
            const result = await fetchDish(params.id)
            if(result) {
                setDish(result)
            }
        }        
        CurrentDish()
    }, [])
    
    useEffect(() => {
        setIngredients(dish.ingredients)

        async function fetchFavorite() {
            const response = await ShowFavorite(dish.id)          
            if(response) {
                setFavorite(true)
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
    }, [dish])

    useEffect(() => {
        if(favorite) {
            setIsFavorite(fullHeart)
        }
        if(!favorite) {
            setIsFavorite(heart)
        }
    }, [favorite])  
    

    return (
        <div className='flex flex-col min-h-screen'>
            <RefreshOpenOrderContext.Provider value={{refresh, setRefresh}}>
                <ModalAddDishContext.Provider value={{modalAddItem, setModalAddItem}}>
                    <Nav            
                        isAdmin={user?.isAdmin === '0' ? false : true}
                        value={search}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
                        handleKeyDown={handleKeyDown}
                    />
                    <div className=' px-14 pt-40 pb-[3.38rem] lg:flex lg:flex-col lg:h-full lg:item-center lg:justify-center xl:px-32 lg:pt-52 2xl:px-72'>
                        <div className='lg:hidden flex justify-between'>
                            <TextButton
                                to='/'
                                label='voltar'
                                updateDish={false}
                                cameFrom='details'
                            />
                            <FavoriteButton
                                onClick={handleFavoriteButton}
                                isFavorite={isFavorite}
                            />
                        </div>
                        <div className='lg:grid lg:grid-cols-2 lg:pt-6 lg:relative'>                        
                            <div className='lg:relative'>
                                <div className='hidden lg:block lg:absolute lg:left-0 lg:-top-11 lg:w-full'>
                                    <TextButton
                                        to='/'
                                        label='voltar'
                                        updateDish={false}
                                        cameFrom='details'
                                    />                      
                                </div>
                                
                                <img
                                    src={dishImage}
                                    alt="Name of the meal"
                                    className='my-6 w-[16.5rem] h-[16.5rem] md:w-80 md:h-80 mx-auto lg:w-[24.4rem] lg:h-[24.4rem] max-h-96 rounded-[50%]'
                                />
                            </div>

                            <div>
                                <div className='hidden absolute lg:block lg:-top-[1%]'>
                                    <FavoriteButton
                                        onClick={handleFavoriteButton}
                                        isFavorite={isFavorite}
                                    />
                                </div>
                                <h1 className=' font-medium text-[1.69rem] leading-[140%] text-center lg:text-left lg:text-[2.5rem] lg:leading-[3.5rem]'>
                                    {dish?.dish_name}
                                </h1>
                                <p className='py-6 text-center lg:text-left lg:text-xl overflow-hidden'>
                                    {dish.description}
                                </p>
                                <div className='flex flex-wrap justify-evenly gap-6 pb-12 px-7-[43rem] lg:px-0 lg:gap-3 lg:justify-start'>
                                    {
                                        ingredients?.map(ingr => (
                                            <Tag
                                                label={ingr.name}
                                                key={ingr.id}
                                            />
                                        ))
                                    }
                                </div>
                                <QuantityInput
                                    details={true}
                                    price={dish.price}
                                    dish_id={dish.id}
                                />
                            </div>
                        </div>
                    </div>
                </ModalAddDishContext.Provider>
            </RefreshOpenOrderContext.Provider>
            <div className='mt-auto'>
                <Footer
                    onMenu={false}
                />
            </div>
        </div>
    )
}