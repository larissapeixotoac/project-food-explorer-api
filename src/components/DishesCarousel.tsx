import { useContext, useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import { DessertDishesContext, DrinkDishesContext, MealDishesContext } from '../hooks/categorizedDishesContext'

import { Dish } from '../services/models/IDish'
import { DishCard } from './DishCard'
import { ScreenWidth } from './ScreenWidth'





export const DishesCarousel = () => {
    const mealContext = useContext(MealDishesContext)         
    const drinkContext = useContext(DrinkDishesContext)  
    const dessertContext = useContext(DessertDishesContext)

    const [dishes, setDishes] = useState<Dish[]>([])

    const responsive = {
        lagestDesktop: {
            breakpoint: { max: 4000, min: 1676 },
            items: 5,
        },
        superLargeDesktop: {
            breakpoint: { max: 1675, min: 1451 },
            items: 4,
        },
        largeDesktop: {
            breakpoint: { max: 1450, min: 1281 },
            items: 3,
            partialVisibilityGutter: 60
        },
        desktop: {
            breakpoint: { max: 1280, min: 1024 },
            items: 3,
        },
        largeTablet: {
            breakpoint: { max: 1023, min: 861 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 860, min: 768 },
            items: 2,    
            partialVisibilityGutter: 40      
        },
        smallTablet: {
            breakpoint: { max: 767, min: 621 },
            items: 3,
        },
        largeMobile: {
            breakpoint: { max: 620, min: 501 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 500, min: 421 },
            items: 1,
            partialVisibilityGutter: 170
        },
        smallMobile: {
            breakpoint: { max: 420, min: 0 },
            items: 1,
            partialVisibilityGutter: 100
        }
    }

    function handleSwipeable() {
        const screenWidth = ScreenWidth()
        if(screenWidth > 1023) {
            return false
        } else {
            return true
        }
    }

    useEffect(() => {
        if(mealContext) {
            const dishes = mealContext.checkMeal
            if(dishes){
                setDishes(dishes)
            }
        }
        if(drinkContext) {
            const dishes = drinkContext.checkDrink
            if(dishes){
                setDishes(dishes)
            }
        }
        if(dessertContext) {
            const dishes = dessertContext.checkDessert
            if(dishes){
                setDishes(dishes)
            }
        }
    },[mealContext, drinkContext, dessertContext])

    return (
        <Carousel
            className='Carousel'
            responsive={responsive}
            removeArrowOnDeviceType={["smallMobile", "mobile", "largeMobile", "smallTablet", "tablet", "largeTablet"]}
            infinite={true}
            swipeable={handleSwipeable()}
            draggable={handleSwipeable()}
            itemClass="carousel-item-padding-40-px"
            partialVisible={true}
        >
            {
                dishes.map((dish: Dish) => (                    
                    <DishCard            
                        key={dish.id}                                    
                        dish={dish}
                    />
                ))
            }
        </Carousel>
    )
}