import { useEffect } from 'react';
import { useDispatch, useSelector } from '../store/store';
import { useGetProductsQuery } from '../store/products/products';
import { setProducts, updateProduct, removeProduct, addProduct, initializeFromStorage } from '../store/products/productsSlice';
import { IProduct } from '../store/products/productTypes';

export const useProducts = (limit: number = 10) => {
  const dispatch = useDispatch();
  const { loaded, items } = useSelector((state) => state.products);
  
  // Инициализируем состояние из localStorage только на клиенте
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Загружаем данные из localStorage при первом рендере
      dispatch(initializeFromStorage());
    }
  }, [dispatch]);
  
  // RTK Query только если данные еще не загружены, пропускаем запрос, если данные уже загружены
  const { data, isLoading, error } = useGetProductsQuery(limit, {
    skip: loaded
  });
  
  // Когда данные из API получены, сохраняем их в Redux store
  useEffect(() => {
    if (data && !loaded) {
      dispatch(setProducts(data));
    }
  }, [data, dispatch, loaded]);
  
  // Работаем с кэшированными данными или данными из запроса
  return {
    data: loaded ? items : data,
    isLoading: isLoading && !loaded,
    error,
    loaded
  };
};

// Функции на выходе
export const useProductActions = () => {
  const dispatch = useDispatch();
  
  return {
    updateProduct: (product: IProduct) => {
      dispatch(updateProduct(product));
    },
    addProduct: (product: IProduct) => {
      dispatch(addProduct(product));
    },
    removeProduct: (id: number) => {
      dispatch(removeProduct(id));
    }
  };
};

// Для gh desktop
export async function generateStaticParams() {
  const { loaded, items } = useSelector((state) => state.products);

  const { data: products } = await useGetProductsQuery(10, {
    skip: loaded
  });
  
  return products?.map((product) => ({
    id: product.id.toString(),
  })) || [];
}

