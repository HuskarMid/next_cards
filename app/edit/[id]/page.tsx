'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from '@/app/store/store'
import { updateProduct } from '@/app/store/products/productsSlice'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/app/store/products/productTypes'
import { useGetProductsQuery } from '@/app/store/products/products'
import { useParams } from 'next/navigation'
import { useProducts } from '@/app/hooks/useProducts'

const CreateProductContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
`
const Form = styled.form<{ $chooseImgActive: boolean }>`
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 10px;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    height: ${props => props.$chooseImgActive ? '1050px' : '420px'};
    transition: height 0.5s ease-in-out;
    height: 400px;
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

    width: 77%;
    
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
    min-height: 125px;
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

const Input__Image = styled.img`
    width: 140px;
    height: 165px;
    object-fit: contain;
    position: absolute;
    top: 20px;
    right: 30px;
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
    const params = useParams()

    // Хук получения данных из кэша/api
    const { data, isLoading, error, loaded } = useProducts();

    const editingProduct = data?.find(product => product.id === Number(params.id))

    const [isClient, setIsClient] = useState(false)
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [chooseImgActive, setChooseImgActive] = useState(false)
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        image: ''
    })

    // Инициализация данных при загрузке продукта, которые будут в форме
    useEffect(() => {
        if (editingProduct) {
            setFormData({
                title: editingProduct.title,
                price: String(editingProduct.price),
                description: editingProduct.description,
                image: editingProduct.image
            });
        }
    }, [editingProduct]);

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
            const updatedProduct: IProduct = {
                id: Number(params.id),
                title: formData.title,
                price: Number(formData.price),
                description: formData.description,
                image: formData.image,
                category: editingProduct?.category || 'other'
            }
            
            dispatch(updateProduct(updatedProduct))
            
            if (isClient) {
                router.push('/products')
            }
        } catch (error) {
            console.error('Ошибка при редактировании продукта:', error)
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
        if (isClient) {
            router.back()
        }
    }

    // SSR
    if (!isClient) {
        return <CreateProductContainer>Загрузка...</CreateProductContainer>
    }

    return (
        <CreateProductContainer>
            <BackButton onClick={handleBack}>← Назад</BackButton>
            <PageTitle>Редактирование продукта</PageTitle>
            
            <Form onSubmit={handleSubmit} $chooseImgActive={chooseImgActive}>
                <Input__Image src={editingProduct?.image} alt="Изображение продукта" />
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

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
            </Form>
        </CreateProductContainer>
    )
}

export default CreateProductPage 