
export interface OpenOrder {
    id: number,
    dish_name: string,
    quantity: number,
    price: string|number,
    category: string,
    dish_id: number,
    user_id: number,
    created_at: string,
    updated_at: string
}

export interface IOrders {
    created_at: string,
    dishes: OrderDish[],
    id: number,
    payment_id: number,
    status: string,
    updated_at: string,
    user_id: number
}

export interface OrderDish {
    id: number,
    dish_id: number,
    order_id: number,
    price: number,
    quantity: number,
    created_at: string,
    updated_at: string,
}