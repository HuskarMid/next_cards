'use client'

import { useProducts } from "../../hooks/useProducts";
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IProduct } from "@/app/store/products/productTypes";
import { generateStaticParams } from "@/app/utils/generateStaticParams";

const ProductContainer = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
`

const ProductDetails = styled.div`
    display: flex;
    gap: 40px;
    padding: 20px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`

const ProductImage = styled.img`
    width: 400px;
    height: 400px;
    object-fit: contain;
`

const ProductInfo = styled.div`
    flex: 1;
`

const ProductTitle = styled.h1`
    font-size: 24px;
    margin-bottom: 20px;
    color: black;
    border-bottom: 1px solid #8b8b8b;
    padding-bottom: 10px;
`

const ProductPrice = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: #BFBA30;
    margin-bottom: 10px;
`

const ProductDescription = styled.p`
    font-size: 16px;
    line-height: 1.5;
    color: #666;
`

const BackButton = styled.button`
    padding: 12px 20px;
    background-color: #666;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
    margin-bottom: 20px;
    
    &:hover {
        background-color: #555;
    }
`

const EditButton = styled(BackButton)`
    margin-left: 15px;
    background-color: #BFBA30;
`

const ProductPage = () => {
    const params = useParams();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    
    // Получаем данные через наш хук useProducts
    const { data, isLoading, error } = useProducts(10);
    //Для gh pages
    if (data) {
        generateStaticParams(data);
    }
    
    // Находим нужный продукт по id
    const product = data?.find((p: IProduct) => p.id === Number(params.id));

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleBack = () => {
        if (isClient) {
            window.history.back();
        }
    };

    const handleEdit = () => {
        if (isClient) {
            router.push(`/edit/${params.id}`);
        }
    };

    // SSR
    if (!isClient || isLoading) {
        return <ProductContainer>Загрузка...</ProductContainer>;
    }

    // Обработка ошибок
    if (error) {
        return (
            <ProductContainer>
                <BackButton onClick={handleBack}>← Назад</BackButton>
                <div>Произошла ошибка при загрузке продукта</div>
            </ProductContainer>
        );
    }

    // Если продукт не найден
    if (!product) {
        return (
            <ProductContainer>
                <BackButton onClick={handleBack}>← Назад</BackButton>
                <div>Продукт не найден</div>
            </ProductContainer>
        );
    }

    return (
        <ProductContainer>
            <BackButton onClick={handleBack}>← Назад</BackButton>
            <EditButton onClick={handleEdit}>Редактировать</EditButton>
            <ProductDetails>
                <ProductImage src={product.image} alt={product.title} />
                <ProductInfo>
                    <ProductTitle>{product.title}</ProductTitle>
                    <ProductPrice>{product.price} $</ProductPrice>
                    <ProductDescription>{product.description}</ProductDescription>
                </ProductInfo>
            </ProductDetails>
        </ProductContainer>
    );
};

export default ProductPage;
