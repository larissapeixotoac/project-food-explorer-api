import { useEffect, useState } from 'react'

import { useAuth } from '../hooks/auth'
import { Index } from '../services/favorites'
import { fetchDishes } from '../services/restaurant'
import { Dish } from '../services/models/IDish'

import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { OrderItem } from '../components/OrderItem'
import { handleKeyDown } from '../components/HandleSearchKeyDown'

interface FavoritesType {
    id: number, 
    dish_id: number, 
    user_id: number, 
    created_at: string
}

export const Favorites = () => {
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)
    const [search, setSearch] = useState('')
    const [favorites, setFavorites] = useState<FavoritesType[]>([])
    const [dishes, setDishes] = useState<Dish[]>([])
    const [favoriteDishes, setFavoriteDishes] = useState<Dish[]>([])


    async function FetchFavorites() {
        const response: FavoritesType[] = await Index(user?.id)
        setFavorites(response)        
    }

    const sorteDishes = () => {        
        const listOfDishes = dishes

        const result = favorites.map(fav => { 
            
            return listOfDishes.filter(item => item.id === fav.dish_id)[0]    
        })
        setFavoriteDishes(result)
    }
    
    useEffect(() => {
        FetchFavorites() 
        async function Dishes() {
            const result = await fetchDishes('')
            if(result) {
                setDishes(result)
            }
        }
        Dishes()
    },[])

    useEffect(() => {
        if(dishes.length > 0) {
            sorteDishes()
        }
    },[favorites, dishes])

    return (
        <div className="flex flex-col min-h-screen">
            <Nav
                isAdmin={user?.isAdmin === '0' ? false : true}
                value={search}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
                handleKeyDown={handleKeyDown}
            />
            <div className='pt-[10.5rem] px-9 pb-9 lg:flex lg:pt-[9.15rem] lg:flex-col xl:px-32'>
                <h1 className=' font-medium text-[2rem] pb-7'>
                    Meus favoritos
                </h1>

                <div className='lg:grid lg:grid-cols-4 2xl:grid-cols-5 flex-grow'>
                    {
                        favoriteDishes && 
                        favoriteDishes.map((favorite: Dish, Index: number) => (
                            <OrderItem
                                key={String(Index)}
                                order_id={0}
                                favorite={true}
                                dish_id={favorite.id}
                                quantity={0}
                                FetchFavorites={FetchFavorites}
                                order={false}
                            />
                        ))
                    }
                </div>
            </div>

            <div className='mt-auto'>
                <Footer
                    onMenu={false}
                />
            </div>
        </div>
    )
}