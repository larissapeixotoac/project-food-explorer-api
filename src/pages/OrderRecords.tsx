import { useState } from 'react'

import { useAuth } from '../hooks/auth'

import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { OrderEntry } from '../components/OrderEntry'
import { handleKeyDown } from '../components/HandleSearchKeyDown'

export const OrderRecords = () => {
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)
    const [search, setSearch] = useState('')    

    return (
        <div className="flex flex-col min-h-screen relative">
            <Nav
                isAdmin={user?.isAdmin === '0' ? false : true}    
                value={search}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
                handleKeyDown={handleKeyDown}
            />

            <div className="pt-[10.5rem] px-[2.19rem] lg:px-20 2xl:px-32 pb-14">
                <h1 className='pb-[1.064rem] font-medium text-[2rem] leading-[140%] text-LIGHT_300 lg:hidden'>
                    Pedidos
                </h1>
                <h1 className='pb-[1.064rem] font-medium text-[2rem] leading-[140%] text-LIGHT_300 hidden lg:block lg:pb-[2.15 rem]'>
                    Histórico de pedidos
                </h1>
               
                <OrderEntry
                    isAdmin={user?.isAdmin === '0' ? false : true}
                />
                
            </div>          

            <div className='mt-auto'>
                <Footer
                    onMenu={false}
                />
            </div>
        </div>
    )
}