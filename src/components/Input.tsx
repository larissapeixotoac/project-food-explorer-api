import React, { useState } from 'react'
import magnifier from '../assets/icons/magnifier.svg'

interface InputType {
    label: string,
    type: string,
    placeholder: string,
    icon: boolean,
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

export function Input({ label, type, placeholder, icon, value, onChange }: InputType) {
    const [maxLength, setMaxLength] = useState(() => {
        if(label === "CVC") {
            return 3
        }
        if(label === "Credit-Card") {
            return 19
        }
        if(label === "Validade") {
            return 5
        }
    })
    
    return (
        <div className={`flex flex-col text-left ${placeholder === 'Busque por pratos ou ingredientes' ? 'gap-0' : 'gap-2'}`}>
            <label 
                htmlFor={type}
                className=" font-ff-secundary text-LIGHT_400"
            >
                {label}
            </label>

            <div className={`p-[0.9rem] lg:py-3 bg-DARK_900 rounded-lg focus-within:outline focus-within:outline-1 focus-within:outline-LIGHT_100
                ${icon && 'flex gap-[0.9rem] lg:px-[0.88rem] lg:py-3 '}
                
            `}>
                {icon && 
                    <img src={magnifier} alt="" className=' text-LIGHT_400'/>
                }
                <input
                    minLength={maxLength}
                    maxLength={maxLength}
                    type={type}
                    id={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className=" bg-transparent w-full placeholder:text-LIGHT_500 placeholder:font-ff-secundary autofill:bg-transparent"
                />
            </div>
        </div>
    )
}
