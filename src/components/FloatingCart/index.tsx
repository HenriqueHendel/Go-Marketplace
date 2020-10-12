import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import { acc } from 'react-native-reanimated';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const cartTotalValue = products.reduce(
      (accumulator, currentValue) => {
        accumulator.totalValue += currentValue.price * currentValue.quantity;
        return accumulator;
      },
      { totalValue: 0 },
    );

    return formatValue(cartTotalValue.totalValue);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const amountItems = products.reduce(
      (accumulator, currentValue) => {
        accumulator.totalItens += currentValue.quantity;
        return accumulator;
      },
      {
        totalItens: 0,
      },
    );

    return amountItems.totalItens;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
