import { useState } from 'react'

import { AccountSignUp } from '../services/account.management'

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { TextButton } from '../components/TextButton'
import { Title } from '../components/Title'
import { FormLegend } from '../components/FormLegend'
import { Modal } from '../components/Modal'

import close from '../assets/icons/close.svg'


export function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const [state, setState] = useState(false)

    function handleModalState() {
        const newState = !state
        setState(newState)

        if(newState === false) {
            window.location.replace('/')
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter') {
            handleSignUp(event)
        }
    }

    async function handleSignUp(event: React.MouseEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLDivElement>) {
        event.preventDefault()
        const response = await AccountSignUp({ name, email, password })
        setName('')
        setEmail('')
        setPassword('')

        setMsg( await response) 
        handleModalState()
    }

    return (
        <div
            className='flex flex-col w-80 mx-auto mt-40 md:flex-row md:justify-around md:w-screen lg:justify-center lg:gap-[200px] xl:gap-[300px] md:mt-36'
            onKeyDown={handleKeyDown}
        >
            <Title/>

            <div className={` md:bg-DARK_700 text-center md:p-16 md:rounded-2xl ${state && ' bg-opacity-25 blur'}`}>
                <form
                    className=' mt-16 mb-8 flex flex-col gap-8 md:mt-0'
                >
                    <div>
                        <FormLegend
                            label='Crie sua conta'
                        />
                    </div>

                    <Input
                        label='Seu nome'
                        type='text'
                        placeholder="Exemplo: Maria da Silva"
                        icon={false}                        
                        value={name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                    />

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
                <div className='mb-8'>
                    <Button
                        label='Criar conta'
                        updateDish={false}
                        onClick={handleSignUp}
                    />
                </div>
                <TextButton
                    to='/'
                    label='Já tenho uma conta'
                    updateDish={false}
                    cameFrom='signUp'
                />
            </div>

            <div className={`absolute inset-0 items-center justify-center -top-36 ${state ? 'flex' : 'hidden'}`}>
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