import { useEffect, useState } from 'react'

import careDown from '../assets/icons/careDown.svg'
import { Dish } from '../services/models/IDish'
import { IOrders } from '../services/models/order'
import { fetchClosedOrder, updateClosedOrder } from '../services/order'
import { PayOrder } from '../services/payment'
import { fetchDishes } from '../services/restaurant'

import { Modal } from './Modal'
import close from '../assets/icons/close.svg'


interface OrderCardType {
    isAdmin: boolean
    order: IOrders,
}

async function updateOrderStatus(id: number, status: string) {
    const lastStatus = await fetchClosedOrder(id)
    if(lastStatus) {
        if(status === lastStatus.status) {
            return
        }
        if(lastStatus.status === 'canceled') {
            return 'canceled'
        }
        if(lastStatus.status === 'delivered') {
            return "delivered"
        } 
        if(lastStatus.status === 'pending'  && status !== 'canceled') {
            return await PayOrder(id, status)
        }
        if(lastStatus.status === 'preparing' && status !== 'canceled') {
            return  await updateClosedOrder(id)
        }     
        if(lastStatus.status !== 'delivered' && status === 'canceled'){
            return await PayOrder(id, status)
        }
    }    
}

const PcOrderCards = ({ isAdmin, order }: OrderCardType) => {
    const [status, setStatus] = useState(order.status)   
    const [userStatus, setUserSatus] = useState('')
    const [fixingCode, setFixingCode] = useState(() => {
        const rightCode = order.id.toPrecision(7).split('.')
        return `${rightCode[1]}${rightCode[0]}`
    })
    const [fixingDate, setFixingDate] = useState(() => {
        const rightDate = order.updated_at.split(' ')
        const day = rightDate[0].split('-')
        const year = day[0].split('')
        const time = rightDate[1].split(':')
        return `${day[2]}/${day[1]} às ${time[0]}h${time[1]}`
    })
    const [description, setDescription] = useState('')
    const [allDishes, setAllDishes] = useState<Dish[]>()
    const [dishInfo, setDishInfo] = useState({} as {
        id: number,
        quantity: number
    }[])     

    const [warning, setWarning] = useState('')
    const [state, setState] = useState(false)

    function handleModalState() {
        const newState = !state
        setState(newState)

        if(newState === false) {
            setWarning('')
        }
    }

    useEffect(() => {
        console.log(warning)
        if(warning){
            if(warning.length > 0 && warning !== 'test') {
                handleModalState()
            }
        }
    },[warning])

    useEffect(() => {  
        const dishes = order.dishes
        const dishInfo = dishes.map(dish => {            
            return {
                id: dish.dish_id,
                quantity: dish.quantity
        }})
        setDishInfo(dishInfo)
        const updateStatus = async () => {
            const resultStatus = await updateOrderStatus(order.id, status)
            if(resultStatus === "delivered") {                
                setStatus('delivered')  
                setWarning("O status não pode ser alterado")  
                console.log(warning)
                      
            }
            if(resultStatus === "canceled") {
                setStatus('canceled') 
                setWarning("O status não pode ser alterado")             
            }
        } 
        updateStatus()      

        if(status === 'pending') {
            setUserSatus('Pendente')
        }
        if(status === 'canceled') {
            setUserSatus('Cancelado')
        }
        if(status === 'preparing') {
            setUserSatus('Preparando')
        }
        if(status === 'delivered') {
            setUserSatus('Entregue')
        }
        
    }, [status])

    useEffect(() => {
        async function AllDishes() {
            const result = await fetchDishes('')
            if(result) {
                setAllDishes(result)
            }
        }
        AllDishes()
    },[])

    useEffect(() => {
        if(allDishes) {
            const result = dishInfo.map(info => {
                const test = allDishes.filter(dish => dish.id === info.id)      
                return test[0]          
            })
            const onlyNames = result.map(name => name.dish_name)

            const test = dishInfo.map((info, index) => `${info.quantity} x ${onlyNames[index]}`).join(', ')
            setDescription(test)
        }
    },[allDishes, dishInfo])

    return (
        <tr className='border-b-2 border-DARK_MIL'>
            <th className=' px-6 py-4 border-r-2 border-DARK_MIL text-left'>
                <div className='flex items-center gap-2'>
                    {
                        !isAdmin ?
                            <>
                                {handleStatusDot(status)}
                                {userStatus}
                            </>
                        :
                        <div className='bg-DARK_900 p-4 flex items-center gap-2 w-full relative'>
                            {handleStatusDot(status)}
                            <select 
                                id="order-status" 
                                className=' bg-transparent text-LIGHT_400 font-ff-secundary text-sm focus:outline-none appearance-none z-10 flex-1'
                                value={status}
                                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setStatus(event.target.value)}
                            >                                
                                <option value="pending" className=' bg-DARK_900'>
                                    Pendente
                                </option>
                                <option value="canceled" className=' bg-DARK_900'>
                                    Cancelado
                                </option>
                                <option value="preparing" className=' bg-DARK_900'>
                                    Preparando
                                </option>
                                <option value="delivered" className=' bg-DARK_900'>
                                    Entregue
                                </option>
                            </select>
                            <img src={careDown} alt=""
                                className=' absolute right-4'
                            />

                            <div className={`absolute inset-0 items-center justify-center ${state ? 'flex -right-[300%]' : 'hidden'}`}>
                                <div className='relative'>
                                    <Modal
                                        message={warning}
                                    />
                                    <button
                                        className='absolute top-3 right-3 w-3'
                                        onClick={handleModalState}
                                    >
                                        <img src={close} alt="fechar" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </th>
            <th className='border-r-2 border-DARK_MIL text-left px-6 py-4'>
                <a href={`/orderrecord/${order.id}`}
                    className='text-LIGHT_400'
                >
                    {fixingCode}
                </a>
            </th>
            <th className='border-r-2 border-DARK_MIL text-left px-6 py-4'>
                <a href={`/orderrecord/${order.id}`}
                    className='text-LIGHT_400'
                >
                    {description}
                </a>
            </th>
            <th className='px-6 py-4'>
                {fixingDate}
            </th>
        </tr>
    )    
}

const handleStatusDot = (status: string) => {
    const currentStatus = status

    return (
        <div className={`w-2 h-2 rounded-[100%] 
            ${currentStatus === 'canceled' && 'bg-TOMATO_300'}
            ${currentStatus === 'pending' && 'bg-TOMATO_300'}
            ${currentStatus === 'preparing' && 'bg-CARROT_100'}
            ${currentStatus === 'delivered' && 'bg-MINT_100'}            
        `}></div>
    )
}

const OrderCard = ({ isAdmin, order }: OrderCardType) => {
    const [status, setStatus] = useState(order.status)   
    const [userStatus, setUserSatus] = useState('')
    const [fixingCode, setFixingCode] = useState(() => {
        const rightCode = order.id.toPrecision(7).split('.')
        return `${rightCode[1]}${rightCode[0]}`
    })
    const [fixingDate, setFixingDate] = useState(() => {
        const rightDate = order.updated_at.split(' ')
        const day = rightDate[0].split('-')
        const year = day[0].split('')
        const time = rightDate[1].split(':')
        return `${day[2]}/${day[1]} às ${time[0]}h${time[1]}`
    })
    const [description, setDescription] = useState('')
    const [allDishes, setAllDishes] = useState<Dish[]>()
    const [dishInfo, setDishInfo] = useState({} as {
        id: number,
        quantity: number
    }[])
    const [warning, setWarning] = useState('')
    const [state, setState] = useState(false)

    function handleModalState() {
        const newState = !state
        setState(newState)

        if(newState === false) {
            setWarning('')
        }
    }

    useEffect(() => {
        console.log(warning)
        if(warning){
            if(warning.length > 0 && warning !== 'test') {
                handleModalState()
            }
        }
    },[warning])

    useEffect(() => {  
        const dishes = order.dishes
        const dishInfo = dishes.map(dish => {            
            return {
                id: dish.dish_id,
                quantity: dish.quantity
        }})
        setDishInfo(dishInfo)
        const updateStatus = async () => {
            const resultStatus = await updateOrderStatus(order.id, status)
            
            if(resultStatus === "delivered") {
                setStatus('delivered')  
                setWarning("O status não pode ser alterado")  
                console.log(warning)       
            }
            if(resultStatus === "canceled") {
                setStatus('canceled') 
                setWarning("O status não pode ser alterado")             
            }
        } 
        updateStatus()

        if(status === 'pending') {
            setUserSatus('Pendente')
        }
        if(status === 'canceled') {
            setUserSatus('Cancelado')
        }
        if(status === 'preparing') {
            setUserSatus('Preparando')
        }
        if(status === 'delivered') {
            setUserSatus('Entregue')
        }
    }, [status])

    useEffect(() => {
        async function AllDishes() {
            const result = await fetchDishes('')
            if(result) {
                setAllDishes(result)
            }
        }
        AllDishes()
    },[])

    useEffect(() => {
        if(allDishes) {
            const result = dishInfo.map(info => {
                const test = allDishes.filter(dish => dish.id === info.id)      
                return test[0]          
            })
            const onlyNames = result.map(name => name.dish_name)

            const test = dishInfo.map((info, index) => `${info.quantity} x ${onlyNames[index]}`).join(', ')
            setDescription(test)
        }
    },[allDishes, dishInfo])

    return (
        <div className="flex flex-col gap-4 font-ff-secundary text-sm leading-[160%] text-LIGHT_400 py-4 px-5 border-2 rounded-lg border-DARK_MIL">
            <div className="flex gap-8">
                <div>
                    {fixingCode}
                </div>
                {
                    !isAdmin &&
                    <div className="flex items-center justify-center gap-2">
                        {handleStatusDot(order.status)}
                        {userStatus}
                    </div>
                }
                <div>
                    {fixingDate}
                </div>
            </div>

            <a href={`/orderrecord/${order.id}`}
                className='text-LIGHT_400'
            >
                {description}
            </a>

            {
                isAdmin &&
                <div className='bg-DARK_900 p-4 flex items-center gap-2 w-full relative rounded-[0.315rem]'>
                {handleStatusDot(status)}
                    <select 
                        id="order-status" 
                        className=' bg-transparent text-LIGHT_400 font-ff-secundary text-sm focus:outline-none appearance-none z-10 flex-1'
                        value={status}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setStatus(event.target.value)}
                    >
                        <option value="pending" className=' bg-DARK_900'>
                            Pendente
                        </option>
                        <option value="canceled" className=' bg-DARK_900'>
                            Cancelado
                        </option>
                        <option value="preparing" className=' bg-DARK_900'>
                            Preparando
                        </option>
                        <option value="delivered" className=' bg-DARK_900'>
                            Entregue
                        </option>
                    </select>
                    <img src={careDown} alt=""
                        className=' absolute right-4'
                    />
                    <div className={`absolute inset-0 items-center justify-center ${state ? 'flex z-50 lg-right-[300%]' : 'hidden'}`}>
                        <div className='relative'>
                            <Modal
                                message={warning}
                            />
                            <button
                                className='absolute top-3 right-3 w-3'
                                onClick={handleModalState}
                            >
                                <img src={close} alt="fechar" />
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>          
    )
}

export { OrderCard, PcOrderCards }
