'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from '@/app/store/store'
import { addProduct } from '@/app/store/products/productsSlice'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IProduct } from '@/app/store/products/productTypes'
import { useGetProductsQuery } from '../store/products/products'
import { useProducts } from '../hooks/useProducts'

const CreateProductContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
`

const Form = styled.form<{ $chooseImgActive: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    height: ${props => props.$chooseImgActive ? '1050px' : '420px'};
    transition: height 0.5s ease-in-out;
`

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const Label = styled.label`
    font-size: 16px;
    color: #333;
    font-weight: 500;
`

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    
    &:focus {
        outline: none;
        border-color: #BFBA30;
    }
`

const TextArea = styled.textarea`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    min-height: 100px;
    resize: vertical;
    
    &:focus {
        outline: none;
        border-color: #BFBA30;
    }
`

const Button = styled.button`
    padding: 12px 20px;
    background-color: #BFBA30;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: #a8a42b;
    }
    
    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`

const ErrorMessage = styled.div`
    color: #ff4444;
    font-size: 14px;
    margin-top: 4px;
`

const BackButton = styled(Button)`
    background-color: #666;
    margin-bottom: 20px;
    
    &:hover {
        background-color: #555;
    }
`

const PageTitle = styled.h1`
    color: #ffffff;
    margin-bottom: 20px;
    font-size: 24px;
`

const ImgList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    background: #f5f5f5;
    height: 600px;
    width: 100%;
    padding: 15px;
    border-radius: 5px;
    overflow-y: hidden;
`

const ImageItem = styled.div<{ $selected: boolean }>`
    width: 150px;
    height: 150px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 3px solid ${props => props.$selected ? '#BFBA30' : 'transparent'};
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    background-color: white;
    
    &:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`

const ImgHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 5px 0 5px 0;
`

const ImgTitle = styled.h3`
    font-size: 20px;
    color: #333;
    margin: 0;
`

interface FormErrors {
    title?: string;
    price?: string;
    description?: string;
    image?: string;
}

const CreateProductPage = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    // Запрос на получение изображений продуктов
    const { data, isLoading } = useGetProductsQuery(12)
    const [isClient, setIsClient] = useState(false)
    // Та data, что в кэше
    const { data: cashedData, isLoading: cashedDataLoading, error, loaded } = useProducts();

    
    useEffect(() => {
        setIsClient(true)
    }, [])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [chooseImgActive, setChooseImgActive] = useState(false)
    const [selectedImageUrl, setSelectedImageUrl] = useState('')
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        image: ''
    })

    // Выбор изображения
    const handleSelectImage = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl)
        setFormData(prev => ({
            ...prev,
            image: imageUrl
        }))
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        
        if (!formData.title.trim()) {
            newErrors.title = 'Название обязательно'
        }
        
        if (!formData.price.trim()) {
            newErrors.price = 'Цена обязательна'
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = 'Цена должна быть положительным числом'
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Описание обязательно'
        }
        
        if (!formData.image.trim()) {
            newErrors.image = 'URL изображения обязателен'
        } else if (!formData.image.match(/^https?:\/\/.+\/.+$/)) {
            newErrors.image = 'Введите корректный URL изображения'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setIsSubmitting(true)
        
        try {
            // Создаем новый продукт
            const newProduct: IProduct = {
                id: (cashedData?.length || 0) + 1, // Добавляем проверку на undefined
                title: formData.title,
                price: Number(formData.price),
                description: formData.description,
                image: formData.image,
                category: 'other' // Значение по умолчанию
            }
            
            // Добавляем продукт в store
            dispatch(addProduct(newProduct))
            
            // Перенаправляем на страницу продуктов
            router.push('/products')
        } catch (error) {
            console.error('Ошибка при создании продукта:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleBack = () => {
        router.back()
    }

    const handleChooseImg = (e: React.MouseEvent) => {
        e.preventDefault()
        setChooseImgActive(true)
    }

    // SSR
    if (!isClient || isLoading) {
        return <CreateProductContainer>Загрузка изображений...</CreateProductContainer>
    }

    return (
        <CreateProductContainer>
            <BackButton onClick={handleBack}>← Назад</BackButton>
            <PageTitle>Создание нового продукта</PageTitle>
            
            <Form onSubmit={handleSubmit} $chooseImgActive={chooseImgActive}>
                <FormGroup>
                    <Label htmlFor="title">Название</Label>
                    <Input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Введите название продукта"
                    />
                    {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="price">Цена ($)</Label>
                    <Input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Введите цену"
                        step="0.01"
                    />
                    {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="description">Описание</Label>
                    <TextArea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Введите описание продукта"
                    />
                    {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
                </FormGroup>

                {!chooseImgActive ? (
                    <FormGroup>
                        <Button type="button" onClick={handleChooseImg}>
                            {formData.image ? 'Изменить изображение' : 'Выбрать изображение'}
                        </Button>
                        {formData.image && (
                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <Image 
                                    src={formData.image} 
                                    alt="Выбранное изображение" 
                                    width={150}
                                    height={150}
                                    style={{ 
                                        objectFit: 'contain',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        padding: '5px'
                                    }} 
                                />
                            </div>
                        )}
                    </FormGroup>
                ) : (
                    <>
                        <ImgHeader>
                            <ImgTitle>Выберите изображение</ImgTitle>
                        </ImgHeader>
                        <ImgList>
                            {data?.map((product: IProduct) => (
                                <ImageItem 
                                    key={product.id}
                                    $selected={selectedImageUrl === product.image}
                                    onClick={() => handleSelectImage(product.image)}
                                >
                                    <Image 
                                        src={product.image} 
                                        alt={product.title}
                                        width={150}
                                        height={150}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </ImageItem>
                            ))}
                        </ImgList>
                    </>
                )}

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Создание...' : 'Создать продукт'}
                </Button>
            </Form>
        </CreateProductContainer>
    )
}

export default CreateProductPage 