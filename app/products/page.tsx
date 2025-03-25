'use client'

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useProducts } from "../hooks/useProducts";
import { useDispatch } from "../store/store";
import { removeProduct } from "../store/products/productsSlice";
import { IProduct } from "../store/products/productTypes";
import { useRouter } from "next/navigation";

const Product__Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
`;

const ProductList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    list-style-type: none;
    padding: 0; 
    margin: 0; 
`;

const ProductItem = styled.li`
    position: relative;
    display: flex;
    justify-content: center;
    
    width: 248px;
    height: 250px;
    border: 3px solid var(--secondary-color);
    border-radius: 30px;
    background-color: #fff;

    margin: 15px; 
    padding: 40px;

    transition: all 0.3s ease;
    &:hover {
        transform: scale(1.05);
    }
`;

const ProductItem__Title = styled.div`
    position: absolute;
    top: -1px;
    width: 100%;
    height: 50px;

    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: #9D73FF;
    padding: 10px;

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    & h3 {
        font-size: 17px;
        font-weight: 400;
        color: #ffffff;

        &:hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }
`;

const ProductItem__Bottom = styled.div`
    position: absolute;
    bottom: -1px;
    width: 100%;
    height: 35px;

    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: #9D73FF;
    
    padding: 5px 15px;
    display: flex;

    align-items: center;
    
    & h3 {
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
    }
`;

const ProductItem__Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
`;

const ProductItem__Image = styled.img`
    width: 110px;
    height: 135px;
    object-fit: contain;
`;

const DeleteIcon = styled.img`
    width: 26px;
    height: 26px;
    cursor: pointer;
    transition: transform 0.2s ease;

    margin-left: auto;
    
    &:hover {
        transform: scale(1.2);
    }
`;

const LikeButton = styled.div`
    width: 28px;
    height: 28px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    position: absolute;
    right: -53px;
    top: 15px;

    
    svg {
        width: 25px;
        height: 25px;
        fill: #000000;
        transition: fill 0.2s ease;
    }
    
    &:hover svg {
        fill: #ff5a5a;
        transform: scale(1.2);
    }
    
    &.active svg {
        fill: #ff5a5a;
    }
`;

const ProductInput = styled.input`
    width: 805px;
    height: 30px;

    border-radius: 5px;
    padding: 0 10px;
    background-color: #ffffff;
    margin: 50px 0 10px 0;
    border: 2px solid var(--secondary-color);
    color: #000;
    font-size: 14px;
    font-weight: 600;
    &::placeholder {
        color: #000;
        font-size: 14px;
        font-weight: 600;
    }
`;

const FilterContainer = styled.div`
    display: flex;
    gap: 10px;
    margin: 10px 0;
    justify-content: center;

    position: absolute;
    top: -5px;
    right: 15px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
    padding: 8px 16px;
    border: 2px solid var(--secondary-color);
    border-radius: 5px;
    background-color: ${props => props.$active ? 'var(--secondary-color)' : 'transparent'};
    color: ${props => props.$active ? '#fff' : '#000000'};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: var(--secondary-color);
        color: #fff;
    }
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;

    position: absolute;
    left: 15px;
    top: -12px;
`;

const PaginationPageNumber = styled.div`
    padding: 0px 16px;
    margin-top: 8px;
    color: black;
`;

const PaginationButton = styled.button`
    padding: 3px 16px;
    border: 2px solid var(--secondary-color);
    border-radius: 5px;
    background-color: transparent;
    color: #000;
    font-size: 18px;

    &:first-child {
        margin-right: 10px;
    }
    transition: all 0.2s ease;
    &:hover {
        background-color: var(--secondary-color);
        color: white;
        cursor: pointer;
    }
`;


// Функция для ограничения длины заголовка
const truncateTitle = (title: string, maxLength: number = 35): string => {
    if (!title) return '';
    if (title.length <= maxLength) return title;
    
    const truncated = title.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    let result = lastSpaceIndex > 0 
        ? truncated.substring(0, lastSpaceIndex)
        : truncated;
    
    // Для запятых
    if (result.endsWith(',')) {
        result = result.slice(0, -1);
    }
    
    return result;
};


const Products = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    // Гидратация
    const [isClient, setIsClient] = useState(false);
    // Хук получения данных из кэша/api
    const { data, isLoading, error, loaded } = useProducts(10);
    // Поиск
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState<IProduct[]>([]);
    // Состояние фаворитов и отслеживание лайкнутых продуктов
    const [showFavorites, setShowFavorites] = useState(false);
    const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});
    // Состояние для пагинации (12 продуктов)
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!data) return;
        
        let filtered = data;
        
        // Фильтр избранного
        if (showFavorites) {
            filtered = filtered.filter(product => likedProducts[product.id]);
        }
        
        // Поиск
        if (searchQuery !== '') {
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (currentPage > 0) {
            const startIndex = (currentPage - 1) * 12;
            const endIndex = startIndex + 12;
            const paginatedData = filtered.slice(startIndex, endIndex);
            setFilteredData(paginatedData);
        } else {
            setCurrentPage(1);
        }
    }, [searchQuery, data, showFavorites, likedProducts, currentPage]);
    
    useEffect(() => {
        setIsClient(true);
        // Загрузка лайкнутых продуктов из localStorage
        if (typeof window !== 'undefined') {
            const savedLikes = localStorage.getItem('likedProducts');
            if (savedLikes) {
                try {
                    setLikedProducts(JSON.parse(savedLikes));
                } catch (e) {
                    console.error('Ошибка при загрузке лайкнутых продуктов:', e);
                }
            }
        }
    }, []);


    // Удаление продукта
    const handleDeleteProduct = (event: React.MouseEvent, id: number) => {
        event.stopPropagation();
        if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
            dispatch(removeProduct(id));
        }
    };
    
    // Лайк продукта
    const handleLikeProduct = (event: React.MouseEvent, id: number) => {
        event.stopPropagation();
        setLikedProducts(prev => {
            const newLikes = { ...prev, [id]: !prev[id] };
            
            // Сохраняем состояние лайков в localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('likedProducts', JSON.stringify(newLikes));
            }
            
            return newLikes;
        });
    };

    const handleProductClick = (id: number) => {
        router.push(`/products/${id}`);
    }

    // Логи только на клиенте
    useEffect(() => {
        if (isClient) {
            console.log('Data from cache or API:', data);
            console.log('Is data loaded from cache?', loaded);
        }
    }, [data, loaded, isClient]);

    // Во время SSR
    if (!isClient || isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка при загрузке: {JSON.stringify(error)}</div>;
    }

    return (
        <>
            <Product__Container>
                <PaginationContainer>
                    <PaginationButton onClick={() => setCurrentPage(currentPage - 1)}>←</PaginationButton>
                    <PaginationButton onClick={() => setCurrentPage(currentPage + 1)}>→</PaginationButton>
                    <PaginationPageNumber>{currentPage}</PaginationPageNumber>
                </PaginationContainer>
                <ProductInput 
                    type="text" 
                    placeholder="Поиск..." 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <FilterContainer>
                    <FilterButton 
                        $active={!showFavorites}
                        onClick={() => setShowFavorites(false)}
                    >
                        Все продукты
                    </FilterButton>
                    <FilterButton 
                        $active={showFavorites}
                        onClick={() => setShowFavorites(true)}
                    >
                        Избранное
                    </FilterButton>
                </FilterContainer>
            </Product__Container>

            <ProductList>
                {filteredData.map((product: IProduct) => (
                    <ProductItem key={product.id} onClick={() => handleProductClick(product.id)}>
                        <ProductItem__Title title={product.title}>
                            <h3>{truncateTitle(product.title)}</h3>
                        </ProductItem__Title>
                        <ProductItem__Content>
                            <ProductItem__Image src={product.image} alt={product.title}/>
                            <LikeButton 
                                className={likedProducts[product.id] ? 'active' : ''}
                                onClick={(e) => handleLikeProduct(e, product.id)}
                            >
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </LikeButton>
                        </ProductItem__Content>
                        <ProductItem__Bottom>
                            <h3>{product.price} $</h3>
                            <DeleteIcon 
                                src="trash.svg" 
                                alt="Удалить" 
                                onClick={(e) => handleDeleteProduct(e, product.id)}
                            />
                        </ProductItem__Bottom>
                    </ProductItem>
                ))}
            </ProductList>
        </>
    )
}

export default Products;
