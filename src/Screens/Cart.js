import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { onCartUpdated, offCartUpdated } from '../Fuctions/cartEvents';
import {
  fetchCartItems,
  increaseProductQuantity,
  decreaseProductQuantity,
  removeProductFromCart,
} from '../Fuctions/CartService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  console.log(cartItems);
  useFocusEffect(
    useCallback(() => {
      const fetchItems = async () => {
        try {
          const items = await fetchCartItems();
          setCartItems(items);
        } catch (error) {
          console.error('Failed to fetch cart items:', error);
        }
      };
      fetchItems();
      const subscription = onCartUpdated(fetchItems);
      return () => {
        offCartUpdated(subscription);
      };
    }, []),
  );

  const increaseQuantity = async item => {
    try {
      const newQty = await increaseProductQuantity(item);
      const updatedItems = cartItems.map(cartItem => {
        if (
          cartItem.id === item.id ||
          cartItem.product_id === item.product_id
        ) {
          return { ...cartItem, quantity: newQty };
        }
        return cartItem;
      });
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const decreaseQuantity = async item => {
    try {
      const newQty = await decreaseProductQuantity(item);
      const updatedItems = cartItems.map(cartItem => {
        if (
          cartItem.id === item.id ||
          cartItem.product_id === item.product_id
        ) {
          return { ...cartItem, quantity: newQty };
        }
        return cartItem;
      });
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const removeItem = async item => {
    try {
      await removeProductFromCart(item);
      const updatedItems = cartItems.filter(
        cartItem =>
          cartItem.id !== item.id && cartItem.product_id !== item.product_id,
      );
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item)}
      >
        <Text style={styles.removeText}>X</Text>
      </TouchableOpacity>
      <Image
        source={{ uri: item.image }}
        style={{ width: 100, height: 100, marginBottom: 8, borderRadius: 8 }}
        resizeMode="cover"
      />
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.detail}>Price: RM{item.price}</Text>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
      >
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() => decreaseQuantity(item)}
        >
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 12 }}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() => increaseQuantity(item)}
        >
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Cart Items</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  detail: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 30,
  },
  qtyButton: {
    backgroundColor: '#F70D24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  qtyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F70D24',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 14,
  },
});

export default Cart;
