import React from 'react'

import plus from '../assets/icons/plus.svg'
import close from '../assets/icons/close.svg'

interface ITag { 
    added: boolean, 
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export const NewTag = ({ added, value, onChange, onClick }: ITag) => {
    
    return (
        <div className={` flex items-center justify-center gap-2 font-ff-secundary
            ${added ? 
                ' bg-LIGHT_600 rounded-lg px-4 py-2' 
            : 
                'bg-transparent border border-dashed rounded-lg border-LIGHT_500 py-2 px-4'
            }
        `}>
            <input 
                type="text" 
                placeholder="Adicionar"
                className={` bg-transparent placeholder:font-ff-secundary placeholder:text-LIGHT_500 w-[5rem]
                    ${added && 'hidden'}
                `}                
                value={value}
                onChange={onChange}
                readOnly={added ? true : false}
            />
            {
                added && value
            }
            <button onClick={onClick}>
                <img 
                    src={added ? close : plus} 
                    alt="" 
                    className='w-2'
                />
            </button>
        </div>
    )
}