import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    if (products[0]) {
      if (products[1]) {
        const productForTotal = products.map(product => {
          return product.price * product.quantity;
        });
        const totalCart = productForTotal.reduce((item, next) => {
          const total = item + next;
          return total;
        });
        return formatValue(totalCart);
      }
      return formatValue(products[0].price * products[0].quantity);
    }
    return formatValue(0);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    if (products[0]) {
      if (products[1]) {
        const productForTotalItens = products.map(product => {
          return product.quantity;
        });
        const ItensCart = productForTotalItens.reduce((item, next) => {
          const total = item + next;
          return total;
        });
        return ItensCart;
      }
      return products[0].quantity;
    }
    return 0;
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
