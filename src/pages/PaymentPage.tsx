import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '../hooks/auth'
import { RefreshOpenOrderContext } from '../hooks/RefreshOpenOrderContextProps'
import { DisableDeleteButtonContext } from '../hooks/DisableDeleteButton'

import { Nav } from '../components/Nav'
import { Payment } from "../components/Payment"
import { Footer } from '../components/Footer'
import { ScreenWidth } from '../components/ScreenWidth'

export const PaymentPage = () => {
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)    
    const [refresh, setRefresh] = useState(false)
    const [disable, setDisable] = useState(false)
    const params = useParams()
    const width = ScreenWidth() 

    useEffect(() => {        
        const maxScreenSize = 1024
        
        if(width >= maxScreenSize) {
            if(disable) {
                window.location.replace(`/orderrecord/${params.id}`)
            } else {
                window.location.replace('/orderconfirmation')
            }
        }
    },[width])

    useEffect(() => {
        if(Number(params.id) > 0) {
            setDisable(true)
        }
    })

    return (
        <div className='flex flex-col min-h-screen'>
            <RefreshOpenOrderContext.Provider value={{refresh, setRefresh}}>
            <Nav
                isAdmin={user?.isAdmin === '0' ? false : true}
                value={''}
                onChange={() => {}}
                handleKeyDown={() => {}}
            />
            <DisableDeleteButtonContext.Provider value={{disable, setDisable}}>
            <div className='flex-grow pt-[10.5rem]'>
                <Payment
                    paid={disable ? true : false}
                />
            </div>
            </DisableDeleteButtonContext.Provider>
            </RefreshOpenOrderContext.Provider>
            <div className='mt-auto'>
                <Footer
                    onMenu={false}
                />
            </div>
        </div>
    )
}
