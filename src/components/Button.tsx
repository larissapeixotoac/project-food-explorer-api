import React from 'react'
import { ButtonType } from '../components/TextButton'

export type { ButtonType } from '../components/TextButton'

interface IButton extends ButtonType {
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export function Button({ label, updateDish, onClick }: IButton) {

    return (
        <button
            onClick={onClick}
            className={`py-3 rounded-[0.315rem] font-medium text-sm leading-6 flex-1
                ${updateDish ? 'bg-TOMATO_400 lg:flex-initial lg:px-6 lg:py-3' : 'bg-TOMATO_100 md:w-[21.75rem]'}
                ${label === 'Criar conta' && 'flex item-center justify-center px-0'}
            `}
        >
            {label}
        </button>
        )
}
 