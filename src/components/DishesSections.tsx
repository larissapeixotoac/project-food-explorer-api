import { useContext, useEffect, useState } from "react"

import { DessertDishesContext, DrinkDishesContext, MealDishesContext } from "../hooks/categorizedDishesContext"

import { DishesCarousel } from "./DishesCarousel"

export function DishesSections({ title }: { title: string}) {   
    const [length, setLength] = useState(0)

    const mealContext = useContext(MealDishesContext)         
    const drinkContext = useContext(DrinkDishesContext)  
    const dessertContext = useContext(DessertDishesContext)
    
    useEffect(() => {
        if(mealContext) {
            const lenght = mealContext.checkMeal.length
            if(lenght){
                setLength(lenght)
            }
        }
        if(drinkContext) {
            const lenght = drinkContext.checkDrink.length
            if(lenght){
                setLength(lenght)
            }
        }
        if(dessertContext) {
            const lenght = dessertContext.checkDessert.length
            if(lenght){
                setLength(lenght)
            }
        }
    },[mealContext, drinkContext, dessertContext])

    return (
        <div className='relative w-full'>
            <h1 className=' mb-6 text-lg md:text-2xl lg:text-[2rem] lg:leading-[2.85rem]'>
                {title}
            </h1>
            
            <div id='leftGradient' className={`hidden lg:block absolute left-0 w-[13.15rem] h-[18.25rem] md:w-64 md:h-[23.5rem] lg:w-[19rem] lg:h-[30rem] bg-DARK_400 z-10 2xl:-left-1 
                ${length < 3 ? 'lg:hidden' : 'lg:block'}
                ${length < 4 ? 'xl:hidden' : 'xl:block'}
            
            `}></div>

            <div id='rightGradient' className={`hidden lg:block absolute right-0 w-[13.15rem] h-[18.25rem] md:w-64 md:h-[23.5rem] lg:w-[19rem] lg:h-[30rem] bg-DARK_400 z-10 2xl:-right-1 
                ${length < 3 ? 'lg:hidden' : 'lg:block'}
                ${length < 4 ? '2xl:hidden' : '2xl:block'}
            `}></div>

            <DishesCarousel
            />         
                       
        </div>
    )
}