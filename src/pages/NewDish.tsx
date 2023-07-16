import { useEffect, useState } from 'react'

import { useAuth } from '../hooks/auth'
import { createDish, updateImage } from '../services/restaurant'

import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { FormDish } from '../components/FormDish'
import { Modal } from '../components/Modal'
import { handleKeyDown } from '../components/HandleSearchKeyDown'

import close from '../assets/icons/close.svg'

export const NewDish = () => {
    const { user } = useAuth()
    // const [isAdmin, setIsAdmin] = useState(user?.isAdmin === '0' ? false : true)
    const [search, setSearch] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('meal')
    const [msg, setMsg] = useState('test')
    const [state, setState] = useState(false)
    const [currentImage, setCurrentImage] = useState<File>()

    async function handleCreateNewDish(newIngredient: string, listOfIngredients: string[]) {
        if(newIngredient) {
            setMsg("Existe um ingrediente a ser adicionado. Adicione ou deixe o campo vazio.")
            return 
        } 

        if(listOfIngredients.length === 0) {
            setMsg("Adicione pelo menos um ingrediente.")
            return
        }

        const newDish = {
            dish_name: name,
            category: selectedCategory,
            price: price,
            description: description,
            ingredients: listOfIngredients
        }

        const result = await createDish(newDish)        

        if(result.dish_id) {
            if(currentImage) {
                await updateImage(currentImage, result.dish_id)
            }
            setMsg(await result.message)
        } else {
            setMsg(await result.message)
        }
    }

    const handleModalState = () => {
        const newState = !state
        setState(newState)

        if(newState === false) {      
            if(msg === 'Prato adicionado com sucesso.') {
                setMsg('')
                window.location.replace('/')
            }
            setMsg('')
        }
    }

    async function handleSelectImage(files: FileList|null) {
        if(files) {
            const selectedFile = files[0] || ''            
            setCurrentImage(selectedFile)
        }
    }

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
                    mode='new'
                    dish_name={name}
                    nameOnChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                    selectedCategory={selectedCategory}
                    categoryOnChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(event.target.value)}
                    price={price}
                    priceOnChange={(event: React.ChangeEvent<HTMLInputElement>) => setPrice(event.target.value)}
                    description={description}
                    descriptionOnChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
                    handleCreateNewDish={handleCreateNewDish}
                    listOfIngredients={[]}
                    handleUpdateListOfIngredients={() => {}}
                    handleDeleteDish={() => {}}    
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