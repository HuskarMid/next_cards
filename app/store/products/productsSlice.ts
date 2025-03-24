import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProduct } from './productTypes';

interface ProductsState {
  items: IProduct[];
  loaded: boolean;
}

// Безопасно проверяем наличие данных в localStorage
const loadFromStorage = (): ProductsState => {
  // Начальное состояние без данных
  const initialEmpty = { items: [], loaded: false };
  
  // SSR
  if (typeof window === 'undefined') {
    return initialEmpty;
  }
  
  try {
    const savedState = localStorage.getItem('cachedProducts');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return { 
        items: Array.isArray(parsed.items) ? parsed.items : [], 
        loaded: true 
      };
    }
  } catch (e) {
    console.error('Ошибка при загрузке кэша продуктов:', e);
  }
  
  return initialEmpty;
};

// Сохранение в localStorage
const saveToStorage = (items: IProduct[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cachedProducts', JSON.stringify({ items }));
    } catch (e) {
      console.error('Ошибка при сохранении в localStorage:', e);
    }
  }
};

// Для SSR используем пустое начальное состояние
// Реальные данные будут загружены на клиенте
const initialState: ProductsState = { items: [], loaded: false };

export const productsSlice = createSlice({
  name: 'cachedProducts',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.items = action.payload;
      state.loaded = true;
      saveToStorage(action.payload);
    },
    updateProduct: (state, action: PayloadAction<IProduct>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      console.log(index)
      if (index !== -1) {
        state.items[action.payload.id - 1] = action.payload;
        saveToStorage(state.items);
      } else {
        console.log('Product not found in state')
      }
    },
    addProduct: (state, action: PayloadAction<IProduct>) => {
      state.items.push(action.payload);
      saveToStorage(state.items);
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveToStorage(state.items);
    },
    clearCache: (state) => {
      state.items = [];
      state.loaded = false;
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('cachedProducts');
        } catch (e) {
          console.error('Ошибка при очистке localStorage:', e);
        }
      }
    },
    // Инициализация состояния из localStorage на клиенте
    initializeFromStorage: (state) => {
      const storedState = loadFromStorage();
      if (storedState.loaded) {
        state.items = storedState.items;
        state.loaded = true;
      }
    }
  },
});

export const { 
  setProducts, 
  updateProduct, 
  addProduct, 
  removeProduct, 
  clearCache,
  initializeFromStorage
} = productsSlice.actions;

export default productsSlice.reducer; 