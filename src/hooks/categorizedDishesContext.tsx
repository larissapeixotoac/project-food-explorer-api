import { createContext } from "react"
import { Dish } from "../services/models/IDish"

export interface MealDishesContextProps {
    checkMeal: Dish[],
    setCheckMeal: (checkMeal: Dish[]) => void
}

export const MealDishesContext = createContext<MealDishesContextProps | undefined>(undefined)


export interface DrinkDishesContextProps {
    checkDrink: Dish[],
    setCheckDrink: (checkDrink: Dish[]) => void
}

export const DrinkDishesContext = createContext<DrinkDishesContextProps | undefined>(undefined)


export interface DessertDishesContextProps {
    checkDessert: Dish[],
    setCheckDessert: (checkDessert: Dish[]) => void
}

export const DessertDishesContext = createContext<DessertDishesContextProps | undefined>(undefined)