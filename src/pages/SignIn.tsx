import React, { useEffect, useState } from 'react'

import { signIn } from '../services/auth'

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { TextButton } from '../components/TextButton'
import { Title } from '../components/Title'
import { FormLegend } from '../components/FormLegend'
import { Modal } from '../components/Modal'

import close from '../assets/icons/close.svg'

export function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('test')
    const [state, setState] = useState(false)

    function handleModalState() {
        const newState = !state
        setState(newState)

        if(newState === false) {
            setMsg('')
        }
    }

    async function handleSignIn(event: React.MouseEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLDivElement>) {
        event.preventDefault()
        const response = await signIn(email, password)
        if(response) {
            setMsg( await response)  
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter') {            
            handleSignIn(event);
        }
    }

    useEffect(() => {
        if(msg.length > 0 && msg !== 'test') {
            handleModalState()
        }
    },[msg])
   
    return (
        <div
            className='flex flex-col w-80 mx-auto mt-40 md:flex-row md:justify-around md:w-screen lg:justify-center lg:gap-[12.5rem] xl:gap-[18.75rem] md:mt-36 relative'
            onKeyDown={handleKeyDown}
        >
            <Title/>

            <div className={` md:bg-DARK_700 text-center md:p-16 md:rounded-2xl ${state && ' bg-opacity-25 blur'}`}>
                <form
                    className=' mt-16 mb-8 flex flex-col gap-8 md:mt-0'
                >
                    <div>
                        <FormLegend
                            label='Faça login'
                        />
                    </div>

                    <Input
                        label='Email'
                        type='email'
                        placeholder="Exemplo: exemplo@exemplo.com.br"
                        icon={false}
                        value={email}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    />
                    <Input
                        label='Senha'
                        type='password'
                        placeholder="No mínimo 6 caracteres"
                        icon={false}
                        value={password}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    />
                </form>
                <div className='mb-8 flex'>
                    <Button
                        label='Entrar'
                        updateDish={false}
                        onClick={handleSignIn}
                    />
                </div>
                
                <TextButton
                    to='/register'
                    label='Criar uma conta'
                    updateDish={false}
                    cameFrom='signIn'
                />
            </div>

            <div className={`absolute inset-0 items-center justify-center ${state ? 'flex' : 'hidden'}`}>
                <div className='relative'>
                    <Modal
                        message={msg}
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
    )
}