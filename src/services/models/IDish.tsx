export interface Dish {
    id: number,
    dish_name: string,
    category: string,
    price: string,
    description: string,
    admin_id: string,
    image: string,
    created_at: string,
    updated_at: string,
    ingredients: DataIngredients[]
}

export interface DataIngredients {
    id: number,
    name: string,
    dish_id: string,
    admin_id: string
}