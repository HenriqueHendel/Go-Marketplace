import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

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
      const storagedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      if (storagedProducts) {
        setProducts([...JSON.parse(storagedProducts)]);
      }
    }

    loadProducts();
  }, [products]);

  const addToCart = useCallback(
    async product => {
      const newProduct = product;

      const existentProductOnCart = products.find(
        cartProduct => newProduct.id === cartProduct.id,
      );

      if (existentProductOnCart) {
        setProducts(
          products.map(cartProduct =>
            cartProduct === existentProductOnCart
              ? { ...newProduct, quantity: cartProduct.quantity + 1 }
              : cartProduct,
          ),
        );
      } else {
        setProducts([...products, { ...newProduct, quantity: 1 }]);
      }
      await AsyncStorage.setItem(
        '@GoMarketplace: products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const existentProductOnCart = products.find(
        cartProduct => cartProduct.id === id,
      );

      if (existentProductOnCart) {
        const newProducts = products.map(cartProduct =>
          cartProduct === existentProductOnCart
            ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
            : cartProduct,
        );
        setProducts(newProducts);

        await AsyncStorage.setItem(
          '@GoMarketplace: products',
          JSON.stringify(newProducts),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const existentProductOnCart = products.find(
        cartProduct => cartProduct.id === id,
      );

      if (existentProductOnCart) {
        if (existentProductOnCart.quantity === 1) {
          const cartWithoutTheProduct = products.filter(
            cartProduct => cartProduct.id !== id,
          );

          setProducts(cartWithoutTheProduct);
          await AsyncStorage.setItem(
            '@GoMarketplace: products',
            JSON.stringify(cartWithoutTheProduct),
          );
        } else {
          const newProducts = products.map(cartProduct =>
            cartProduct === existentProductOnCart
              ? { ...cartProduct, quantity: cartProduct.quantity - 1 }
              : cartProduct,
          );
          setProducts(newProducts);
          await AsyncStorage.setItem(
            '@GoMarketplace: products',
            JSON.stringify(newProducts),
          );
        }
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
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
