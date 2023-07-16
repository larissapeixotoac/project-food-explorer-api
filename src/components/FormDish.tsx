import React, { useEffect, useState } from 'react'

import { TextButton } from '../components/TextButton'
import { NewTag } from '../components/NewTag'
import { Button } from '../components/Button'

import upload from '../assets/icons/upload.svg'
import careDown from '../assets/icons/careDown.svg'

interface IFormDish{
    mode: string,
    dish_name: string,
    nameOnChange: React.ChangeEventHandler<HTMLInputElement>,
    selectedCategory: string,
    categoryOnChange: React.ChangeEventHandler<HTMLSelectElement>,
    listOfIngredients: string[],
    price: string,
    priceOnChange: React.ChangeEventHandler<HTMLInputElement>,
    description: string,
    descriptionOnChange: React.ChangeEventHandler<HTMLTextAreaElement>,
    handleUpdateListOfIngredients: Function,
    handleDeleteDish: Function,
    handleCreateNewDish: Function,
    handleSelectImage: Function

}
export const FormDish = (props: IFormDish) => {
    const [listOfIngredients, setListOfIngredients] = useState<string[]>([])
    const [newIngredient, setNewIngredient] = useState('')    
    const [controller, setController] = useState(0)  

    const removeIngredient = (event: React.MouseEvent<HTMLButtonElement>, deletedIngredient: string) => {
        event.preventDefault() 
        const updatedList = listOfIngredients.filter(ingr => ingr !== deletedIngredient)
        setListOfIngredients(updatedList)        
    }

    const addIngredients = (event: React.MouseEvent<HTMLButtonElement>, ingredient: string) => {
        event.preventDefault()
        setListOfIngredients(prevState => [...prevState, ingredient])
        setNewIngredient('')
    }  

    const createDish = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        props.handleCreateNewDish(newIngredient, listOfIngredients)
    }

    const updateDish = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setController(0)
        props.handleUpdateListOfIngredients(newIngredient, listOfIngredients)
    }

    const removeDish = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setController(0)
        props.handleDeleteDish()
    }

    useEffect(() => {
        if(controller === 0 && props.mode === 'new') {
            setListOfIngredients(props.listOfIngredients)
            setController(5)
            
        } 
        
        if(props.mode === 'edit'){
            setListOfIngredients(props.listOfIngredients)
        }
    }, [props.listOfIngredients])    
     
    return (
        <div className='lg:max-w-[85.5rem] lg:mx-auto'>
            <div className=' pt-32 px-8 pb-[3.32rem] flex flex-col gap-6 lg:pt-[8.5rem]'>
                <TextButton
                    to='/'
                    label='voltar'
                    updateDish={true}
                    cameFrom='FormDish'
                />

                <form>
                    <fieldset>
                        <div className='flex flex-col gap-6 lg:gap-8'>
                            <legend className=' font-medium text-[2rem] leading-[140%] text-LIGHT_300'>
                                {
                                    props.mode === 'edit' ?
                                        'Editar prato'
                                    :
                                        'Novo prato'
                                }
                            </legend>
                            
                            <div className='flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-center'>
                                <div className='flex flex-col gap-4'>
                                    <label
                                        htmlFor="dish-img"
                                        className=' font-ff-secundary text-LIGHT_400'
                                    >
                                        Imagem do prato
                                    </label>
                                    <label className='flex items-center gap-2 bg-DARK_800 rounded-lg px-8 py-3 cursor-pointer font-medium text-sm'>
                                        <img src={upload} alt="" />
                                        Selecionar imagem
                                        <input
                                            type='file'
                                            id='image'
                                            className='hidden'
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.handleSelectImage(event.target.files)}
                                        />
                                    </label>
                                </div>
                                <div className='flex flex-col gap-4 lg:flex-1'>
                                    <label htmlFor="event-name">Nome</label>
                                    <input
                                        type='text'
                                        id='event-name'
                                        placeholder='Ex.: Salada Ceasar'
                                        required
                                        className=' bg-DARK_800 rounded-lg px-[0.88rem] py-3 placeholder:font-ff-secundary placeholder:text-LIGHT_500'
                                        value={props.dish_name || ''}
                                        onChange={props.nameOnChange}
                                    />
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <label htmlFor="event-file">Categoria</label>
                                    <div className='bg-DARK_900 rounded-[0.315rem] p-4 flex relative lg:bg-DARK_800'>
                                        <select
                                            id="event-category"
                                            className=' w-full bg-transparent text-LIGHT_400 font-ff-secundary text-sm focus:outline-none appearance-none z-10 xl:pr-60'
                                            value={props.selectedCategory}
                                            onChange={props.categoryOnChange}
                                        >
                                            <option value="meal" className=' bg-DARK_900'>Refeição</option>
                                            <option value="drink" className=' bg-DARK_900'>Bebida</option>
                                            <option value="dessert" className=' bg-DARK_900'>Sobremesa</option>
                                        </select>
                                        <img src={careDown} alt=""
                                            className='absolute right-4 top-1/3'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-8'>
                                <div className='flex flex-col gap-4 lg:flex-1'>
                                    <label htmlFor="Ingredients">Ingredientes</label>
                                    <div className='flex flex-wrap gap-4 p-2 bg-DARK_800 rounded-lg'>
                                        {
                                            props.listOfIngredients &&
                                            listOfIngredients.map((ingredient: string, index: number) => (
                                                <NewTag
                                                    key={String(index)}
                                                    added={true}
                                                    value={ingredient}      
                                                    onChange={() => {}}                                                         
                                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => removeIngredient(event, ingredient)}               
                                                />
                                            ))
                                        }                                        
                                        
                                        <NewTag
                                            added={false}
                                            value={newIngredient}   
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewIngredient(event.target.value)}                                         
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => addIngredients(event, newIngredient)}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <label htmlFor="event-price">Preço</label>
                                    <input
                                        type='string'
                                        id='event-price'
                                        placeholder='R$ 00,00'
                                        step='0.01'
                                        required
                                        className='bg-DARK_800 rounded-lg px-[0.88rem] py-3 placeholder:font-ff-secundary placeholder:text-LIGHT_500'
                                        value={props.price || ''}
                                        onChange={props.priceOnChange}
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col gap-4'>
                                <label htmlFor="description">Descrição</label>
                                <textarea
                                    id="descriptio"
                                    placeholder='Fale brevemente sobre o prato, seus ingredientes e composição'
                                    className='bg-DARK_800 rounded-lg px-[0.88rem] py-3 placeholder:font-ff-secundary placeholder:text-LIGHT_500 min-h-[10.8rem] resize-none'
                                    value={props.description || ''}
                                    onChange={props.descriptionOnChange}
                                />
                            </div>
                        </div>

                    </fieldset>
                </form>

                <div className={`flex lg:justify-end 
                    ${props.mode === 'edit' && 'gap-8'}
                `}>
                    {props.mode === 'edit' && 
                        <button 
                            className=' bg-DARK_800 rounded-[0.315rem] py-3 flex-1 font-medium text-sm lg:flex-initial lg:px-6'
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => removeDish(event)}
                        >
                            Excluir prato
                        </button>
                    }
                    <Button
                        label='Salvar alterações'
                        updateDish={true}
                        onClick={props.mode === "edit" ? (event: React.MouseEvent<HTMLButtonElement>) => updateDish(event) : (event: React.MouseEvent<HTMLButtonElement>) => createDish(event)}
                    />
                </div>
            </div>

            
        </div>
    )
}