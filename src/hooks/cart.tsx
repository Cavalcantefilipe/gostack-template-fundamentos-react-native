import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { asin } from 'react-native-reanimated';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const Cart = await AsyncStorage.getItem('@GoMarketplace:cart');
      if (Cart) {
        const arrayProduct: Product[] = JSON.parse(Cart);
        setProducts([...arrayProduct]);
      }
    }
    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const { id, image_url, price, title }: Product = product;
      const productAdd = products.findIndex(
        productArray => productArray.id === id,
      );
      if (!products[productAdd]) {
        products.push({ id, image_url, price, title, quantity: 1 });
      } else {
        products[productAdd].quantity += 1;
      }
      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(products),
      );
      setProducts([...products]);
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productToIncrementIndex: number = products.findIndex(
        product => product.id === id,
      );
      products[productToIncrementIndex].quantity += 1;
      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(products),
      );
      setProducts([...products]);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productToDecrement = products.findIndex(
        product => product.id === id,
      );
      if (products[productToDecrement]) {
        if (products[productToDecrement].quantity > 1) {
          products[productToDecrement].quantity -= 1;
        } else {
          products.splice(productToDecrement, 1);
        }
        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify(products),
        );
        setProducts([...products]);
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({
      addToCart,
      increment,
      decrement,
      products,
    }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
