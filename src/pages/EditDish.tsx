import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '../hooks/auth'
import { DataIngredients, Dish } from '../services/models/IDish'
import { fetchDish, deleteDish, updateDish, updateImage } from '../services/restaurant'

import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { FormDish } from '../components/FormDish'
import { Modal } from '../components/Modal'
import { handleKeyDown } from '../components/HandleSearchKeyDown'

import close from '../assets/icons/close.svg'


export const EditDish = () => {    
    const params = useParams()
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)
    const [search, setSearch] = useState('')
    const [constroller, setController] = useState(0)
    const [dishConstroller, setDishController] = useState(0)
    const [dish, setDish] = useState({} as Dish)
    const [ingredients, setIngredients] = useState<DataIngredients[]>([])
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [listOfIngredients, setListOfIngredients] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [msg, setMsg] = useState('test')
    const [state, setState] = useState(false)    
    const [currentImage, setCurrentImage] = useState<File>()


    async function handleUpdateListOfIngredients(newIngredient: string, updatedList: string[]) {     
        if(newIngredient) {
            setMsg("Existe um ingrediente a ser adicionado. Adicione ou deixe o campo vazio.")
            return 
        }        
        setListOfIngredients(updatedList)
        setDishController(5)
    }  
    
    async function updatedDish() {        
        const updatedDish = {
            dish_name: name,
            category: selectedCategory,
            price: String(price),
            description: description,
            ingredients: listOfIngredients
        }
        
        if(params.id) {
            const result = await updateDish(updatedDish, params.id)
            if(currentImage) {
                await updateImage(currentImage, params.id)
            }
            setMsg(await result)
        }
    }

    async function handleSelectImage(files: FileList|null) {
        if(files) {
            const selectedFile = files[0] || ''            
            setCurrentImage(selectedFile)
        }
    }

    async function handleDeleteDish() {
        if(params.id) {
            const result = await deleteDish(params.id)
            setMsg(await result)
        }
    }

    function handleModalState() {
        const newState = !state
        setState(newState)

        if(newState === false) {
            if(msg === 'Prato excluído com sucesso.') {
                setMsg('')
                window.location.replace('/')
            }         
            setMsg('')
        }
    }

    useEffect(() => {      
        async function CurrentDish() {
            const result = await fetchDish(params.id)
            if(result) {
                setDish(result)
            }
        }        
        CurrentDish()
    }, [])

    useEffect(() => {        
        if(constroller === 0) {
            setIngredients(() => {
                const result = dish.ingredients    
                if(result) {
                    const list = result.map(ingr => ingr.name)
                    setListOfIngredients(list)
                }    
                
                return result         
            })            
            setName(dish.dish_name)           
            setPrice(`R$ ${Number(dish.price).toFixed(2).replace('.', ',')}`)
            setDescription(dish.description)
            setSelectedCategory(dish.category)

            if(ingredients) {
                const length = ingredients.length
                if(length > 0) {
                    setController(1)
                }    
            }            
        }
    }, [dish])  

    useEffect(() => {
        if(dishConstroller > 0) {
            updatedDish()
            setDishController(0)
        }
    }, [dishConstroller])

    useEffect(() => {
        if(msg.length > 0 && msg !== 'test') {
            handleModalState()
        }
    },[msg])     

    return (
        <div className="flex flex-col min-h-screen">
            <Nav
                isAdmin={user?.isAdmin === '0' ? false : true}
                value={search}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
                handleKeyDown={handleKeyDown}
            />
            
            <div>
                <FormDish
                    mode='edit'
                    dish_name={name}     
                    nameOnChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                    selectedCategory={selectedCategory}      
                    categoryOnChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(event.target.value)}    
                    listOfIngredients={listOfIngredients}    
                    price={price}
                    priceOnChange={(event: React.ChangeEvent<HTMLInputElement>) => setPrice(event.target.value)}
                    description={description}
                    descriptionOnChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
                    handleUpdateListOfIngredients={handleUpdateListOfIngredients}
                    handleDeleteDish={handleDeleteDish}
                    handleCreateNewDish={() => {}}
                    handleSelectImage={handleSelectImage}
                />
            </div>

            <div className='mt-auto'>
                <Footer
                    onMenu={false}
                />
            </div>

            <div className={`absolute inset-0 items-center justify-center z-50 ${state ? 'flex' : 'hidden'}`}>
                <div className='relative w-96 -top-20'>
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
