import { useEffect, useState } from 'react'

import { useAuth } from '../hooks/auth'
import { ModalAddDishContext, RefreshOpenOrderContext } from '../hooks/RefreshOpenOrderContextProps'
import { DessertDishesContext, DrinkDishesContext, MealDishesContext } from '../hooks/categorizedDishesContext'
import { Dish } from '../services/models/IDish'
import { fetchDishes } from '../services/restaurant'

import { Nav } from '../components/Nav'
import { DishesSections } from '../components/DishesSections'
import { ScreenWidth } from '../components/ScreenWidth'
import { Footer } from '../components/Footer'

import macarons from '../assets/macarons.svg'
import bigMacarons from '../assets/bigMacarons.svg'

export function Home() { 
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)
    const [search, setSearch] = useState('')
    const [dishes, setDishes] = useState<Dish[]>([])
    const [checkMeal, setCheckMeal] = useState<Dish[]>([])
    const [checkDrink, setCheckDrink] = useState<Dish[]>([])
    const [checkDessert, setCheckDessert] = useState<Dish[]>([])
    const [refresh, setRefresh] = useState(false)
    const [modalAddItem, setModalAddItem] = useState(false)
    
    function sorteDishes() {
        setCheckMeal(dishes.filter(dish => dish.category === 'meal'))
        setCheckDrink(dishes.filter(dish => dish.category === 'drink'))
        setCheckDessert(dishes.filter(dish => dish.category === 'dessert'))
    }
    
    useEffect(() => {
        async function dishes() {
            const result = await fetchDishes(search)
            if(result) {
                setDishes(result)
                sorteDishes()
            }
        }
        dishes()
    }, [search])    

    useEffect(() => {
        sorteDishes()
    }, [dishes])

    useEffect(() => {
        const searchInfo = window.localStorage.getItem('@foodexplorer:searchBar')
        if(searchInfo) {
            setSearch(searchInfo)
            window.localStorage.removeItem('@foodexplorer:searchBar')
        }
    },[])

    return (
        <div>
            <RefreshOpenOrderContext.Provider value={{refresh, setRefresh}}>
                <ModalAddDishContext.Provider value={{modalAddItem, setModalAddItem}}>
                    <Nav
                        isAdmin={user?.isAdmin === '0' ? false : true}
                        value={search}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}                    
                        handleKeyDown={() => {}}            
                        />

                    <div>
                        <div className="flex flex-col mb-[3.9rem] ">
                            <div className='flex flex-col pb-5 pr-5 items-end justify-end gap-1 min-w-[23.5rem] h-32 ml-9 relative bg-gradient-to-b from-gradient_200-0 to-gradient_200-1 mt-40 mr-4 md:mx-16 md:h-40 lg:h-60 md:pr-16 md:justify-center md:pb-0 lg:mt-52 xl:mx-32 xl:mt-64 xl:h-[16.5rem] xl:pr-[7rem] 2xl:items-center 2xl: 2xl:pr-0 2xl:pl-96 
                            '>
                                <img
                                    src={ScreenWidth() >= 768 ? bigMacarons : macarons}
                                    alt="" className='absolute bottom-0 -left-7 md:w-72 lg:w-[30rem] lg:-left-14 xl:w-[39.5rem]'
                                    />
                                <h2 className='w-52 font-medium text-lg leading-6 text-LIGHT_300 md:text-3xl md:w-80 lg:text-[2.5rem] lg:w-[26.5rem] 2xl:text-6xl 2xl:w-[40rem] '>Sabores inigualáveis</h2>
                                <p className=' w-52 text-xs text-LIGHT_300 font-light md:font-ff-secundary md:w-80 lg:text-base lg:w-[26.5rem] 2xl:text-xl 2xl:w-[33rem]'>Sinta o cuidado do preparo com ingredientes selecionados.</p>
                            </div>
                        </div>
                        
                        <div className=' pl-6 mb-6 md:px-16 md:mb-9 xl:mb-12 xl:px-32 flex flex-col gap-6 lg:gap-12'>

                            <div >
                                {
                                    checkMeal.length > 0 && 
                                    <MealDishesContext.Provider value={{checkMeal, setCheckMeal}}>
                                        <DishesSections
                                            title='Refeições'
                                        />    
                                    </MealDishesContext.Provider>                        
                                }
                            </div>
                            <div >
                                {                                    
                                    checkDrink.length > 0 &&
                                    <DrinkDishesContext.Provider value={{checkDrink, setCheckDrink}}>
                                        <DishesSections
                                            title='Bebidas'
                                        />   
                                    </DrinkDishesContext.Provider>                                                             
                                }
                            </div>
                            <div >
                                {
                                    checkDessert.length > 0 &&
                                    <DessertDishesContext.Provider value={{checkDessert, setCheckDessert}}>
                                        <DishesSections
                                            title='Sobremesas'
                                        />   
                                    </DessertDishesContext.Provider>                                    
                                }
                            </div>
                        
                        </div>
                    </div>
                </ModalAddDishContext.Provider>
            </RefreshOpenOrderContext.Provider>
            <Footer
                onMenu={false}
                />

        </div>
    )
}