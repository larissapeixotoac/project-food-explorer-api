export const correctingPrice = (price: string) => {
    const rightPrice = price.split(' ').map(stg => stg.trim())
    if(rightPrice.length === 1) {
        return`R$ ${rightPrice[0]}`
    } else {
        return price
    }
}

export const quantityOfDishes = (operator: string, quantity: number) => {
    let num = quantity

    if(operator === 'minus' && num === 1) {
        return
    }
    if(operator === 'plus') {
        num++
    } 
    if(operator === 'minus') {
        num--
    }

    return num
}

export const updatePrice = (multiplier: number, price: number) => {
    const result = Number(multiplier * price).toFixed(2).replace('.', ',')
    return `R$ ${result}`
}