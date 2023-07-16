import { Link } from 'react-router-dom'

import caretLeft from '../assets/icons/caretLeft.svg'
import { SignOut } from '../services/auth'

interface ButtonType {
    label: string, 
    updateDish: boolean
}

interface ITextButtonOnly extends ButtonType {
    to: string,
    cameFrom: string
}

function TextButton({ label, updateDish, to, cameFrom }: ITextButtonOnly) {
    const handleLinkLocation = () => {
        if(cameFrom === 'menu-options') {
            window.localStorage.removeItem('@foodexplorer:location')
        }
        if(label === 'Sair') {
            SignOut()
        }
    }

    return (
        <Link
            to={to}
            onClick={handleLinkLocation}
            className={`
                ${label === 'Criar uma conta' || label === 'Já tenho uma conta'  ? ' text-sm font-medium' : 'font-light text-2xl leading-[140%] text-LIGHT_300 '}
                ${label === 'voltar' && 'flex items-center gap-[0.625rem] font-medium'}
                ${updateDish ? 'text-base lg:text-2xl' : 'text-2xl'}
            `}
        >
            {label === 'voltar' && 
                <img 
                    src={caretLeft} 
                    alt="voltar" 
                    className={`${updateDish && 'w-2 lg:w-3'}`}
                />
            }
            {label}
        </Link>
    )
}

export {
    TextButton
}

export type { ButtonType }
