import {
  getCartItems,
  saveOrUpdateCartItem,
  removeCartItem,
} from "../DataBase/CartDB";
import { emitCartUpdated } from "./cartEvents";

// Fetch all cart items
export const fetchCartItems = async () => {
  try {
    return await getCartItems();
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

// Update cart item with quantity validation
export const updateCartItem = async (product, quantity) => {
  try {
    if (!product || (!product.id && !product.product_id)) {
      throw new Error("Invalid product: missing ID");
    }

    // If quantity is 0, remove the item from cart
    if (quantity <= 0) {
      const productId = product.id ?? product.product_id;
      await removeCartItem(productId);
      emitCartUpdated();
      return 0;
    }

    // Ensure quantity is never below 1
    const validatedQuantity = Math.max(1, quantity);

    // Save or update the cart item
    const result = await saveOrUpdateCartItem(product, validatedQuantity);
    emitCartUpdated();
    return result;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// Get quantity for a specific product
export const getProductQuantity = async (productId) => {
  try {
    if (!productId) {
      console.warn("Product ID is required for getProductQuantity");
      return 0;
    }

    const cartItems = await getCartItems();
    const item = cartItems.find(
      (i) => i.id === productId || i.product_id === productId
    );
    return item ? item.quantity : 0;
  } catch (error) {
    console.error("Error getting product quantity:", error);
    return 0;
  }
};

// Increase quantity for a product
export const increaseProductQuantity = async (product) => {
  try {
    if (!product || (!product.id && !product.product_id)) {
      throw new Error("Invalid product: missing ID");
    }

    const productId = product.id ?? product.product_id;
    const currentQuantity = await getProductQuantity(productId);
    return await updateCartItem(product, currentQuantity + 1);
  } catch (error) {
    console.error("Error increasing product quantity:", error);
    throw error;
  }
};

// Decrease quantity for a product (can go to 0)
export const decreaseProductQuantity = async (product) => {
  try {
    if (!product || (!product.id && !product.product_id)) {
      throw new Error("Invalid product: missing ID");
    }

    const productId = product.id ?? product.product_id;
    const currentQuantity = await getProductQuantity(productId);

    if (currentQuantity <= 1) {
      // If quantity is 1, set it to 0 to remove from cart
      await removeCartItem(productId);
      emitCartUpdated();
      return 0;
    }

    return await updateCartItem(product, currentQuantity - 1);
  } catch (error) {
    console.error("Error decreasing product quantity:", error);
    throw error;
  }
};

// Remove product from cart
export const removeProductFromCart = async (product) => {
  try {
    if (!product || (!product.id && !product.product_id)) {
      throw new Error("Invalid product: missing ID");
    }

    const productId = product.id ?? product.product_id;
    await removeCartItem(productId);
    emitCartUpdated();
  } catch (error) {
    console.error("Error removing product from cart:", error);
    throw error;
  }
};

// Get cart summary (total items, total quantity)
export const getCartSummary = async () => {
  try {
    const cartItems = await getCartItems();
    const totalItems = cartItems.length;
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    return {
      totalItems,
      totalQuantity,
      items: cartItems,
    };
  } catch (error) {
    console.error("Error getting cart summary:", error);
    return { totalItems: 0, totalQuantity: 0, items: [] };
  }
};
