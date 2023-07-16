import { useState } from 'react'

import { useAuth } from '../hooks/auth'
import { RefreshOpenOrderContext } from '../hooks/RefreshOpenOrderContextProps'
import { DisableDeleteButtonContext } from '../hooks/DisableDeleteButton'

import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { OrderList } from '../components/OrderList'
import { ScreenWidth } from '../components/ScreenWidth'
import { Payment } from '../components/Payment'
import { handleKeyDown } from '../components/HandleSearchKeyDown'

export const OrderConfirmation = () => {
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)
    const [search, setSearch] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [disable, setDisable] = useState(false)    

    const minScreenWidth = 1024

    return (
        <div className='flex flex-col min-h-screen '>
            <RefreshOpenOrderContext.Provider value={{refresh, setRefresh}}>
                <Nav
                    isAdmin={user?.isAdmin === '0' ? false : true}
                    value={search}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
                    handleKeyDown={handleKeyDown}
                />
                <DisableDeleteButtonContext.Provider value={{disable, setDisable}}>
                    <div className={`pt-[10.5rem] lg:mx-auto lg:grid lg:grid-cols-2 lg:pt-[9.15rem] lg:gap-[4.69rem]`}>
                        
                        <OrderList
                            open={true}
                        />
                        {
                            ScreenWidth() >= minScreenWidth &&
                            <Payment
                                paid={false}
                            />
                        }
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
