import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/auth'

import { Input } from '../components/Input'
import { TextButton } from '../components/TextButton'
import { Footer } from '../components/Footer'
import { handleKeyDown } from '../components/HandleSearchKeyDown'

import close from '../assets/icons/close.svg'

export function MenuOptions() {
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)
    const [search, setSearch] = useState('')

    const navigate = useNavigate()

    const closeMenuOptions = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const location = window.localStorage.getItem("@foodexplorer:location")
        if(location) {
            window.localStorage.removeItem("@foodexplorer:location")
            navigate(location)
        }
    }

    return (
        <div>            
            <div className=' bg-DARK_700 h-36 pl-7 pb-6 flex gap-4 items-end'>
                <button
                    onClick={closeMenuOptions}
                >
                    <img
                        src={close}
                        alt="close"
                        className='h-[1.13rem] w-[1.13rem] mb-1'
                    />
                </button>
                <h2 className=' font-ff-secundary text-[1.35rem] leading-[1.565rem]'>
                    Menu
                </h2>
            </div>

            <div className=' pt-9 px-7 '>

                <div 
                    className='mb-9'
                    onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(event, search)}                
                >
                    <Input
                        label=''
                        type='text'
                        placeholder='Busque por pratos ou ingredientes'
                        icon={true}
                        value={search}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
                    />
                </div>

                {
                    (user?.isAdmin === '0' ? false : true) &&
                    <div className=' border-b border-b-DARK_MIL p-[0.65rem]'>
                        <TextButton
                            label='Novo prato'
                            updateDish={false}
                            to='/newdish'
                            cameFrom='menu-options'
                        />
                    </div>
                }

                <div className=' border-b border-b-DARK_MIL p-[0.65rem]'>
                    <TextButton
                        label='Histórico de pedidos'
                        updateDish={false}
                        to='/orderrecords'
                        cameFrom='menu-options'
                    />
                </div>

                <div className=' border-b border-b-DARK_MIL p-[0.65rem]'>
                    <TextButton
                        label='Meus favoritos'
                        updateDish={false}
                        to='/favorites'
                        cameFrom='menu-options'
                    />
                </div>

                <div className='border-b border-b-DARK_MIL p-[0.65rem]'>
                    <TextButton
                        label='Sair'                        
                        updateDish={false}
                        to='/'
                        cameFrom='menu-options'
                    />
                </div>
            </div>

            <Footer
                onMenu={true}
            />
        </div>
    )
}