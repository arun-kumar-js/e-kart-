import AsyncStorage from '@react-native-async-storage/async-storage';

const WISHLIST_KEY = 'WISHLIST_ITEMS';

// Get all wishlist items
export const getWishlistItems = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(WISHLIST_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading wishlist items:', e);
    return [];
  }
};

// Add product to wishlist
export const addToWishlist = async (product) => {
  try {
    const items = await getWishlistItems();
    const productId = product.id ?? product.product_id;
    
    if (!productId) {
      console.error('Product ID is required');
      return false;
    }

    // Check if product already exists in wishlist
    const existingIndex = items.findIndex(
      item => item.id === productId || item.product_id === productId
    );

    if (existingIndex >= 0) {
      console.log('Product already in wishlist');
      return true;
    }

    // Add new product to wishlist
    const wishlistItem = {
      ...product,
      id: productId,
      product_id: productId,
      added_at: new Date().toISOString(),
    };

    items.push(wishlistItem);
    await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    
    console.log('Product added to wishlist:', product.name);
    return true;
  } catch (e) {
    console.error('Error adding to wishlist:', e);
    return false;
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const items = await getWishlistItems();
    const filtered = items.filter(
      item => item.id !== productId && item.product_id !== productId
    );
    
    await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
    
    console.log('Product removed from wishlist');
    return true;
  } catch (e) {
    console.error('Error removing from wishlist:', e);
    return false;
  }
};

// Check if product is in wishlist
export const isInWishlist = async (productId) => {
  try {
    const items = await getWishlistItems();
    return items.some(
      item => item.id === productId || item.product_id === productId
    );
  } catch (e) {
    console.error('Error checking wishlist status:', e);
    return false;
  }
};

// Clear all wishlist items
export const clearWishlist = async () => {
  try {
    await AsyncStorage.removeItem(WISHLIST_KEY);
    console.log('Wishlist cleared');
    return true;
  } catch (e) {
    console.error('Error clearing wishlist:', e);
    return false;
  }
};

// Get wishlist count
export const getWishlistCount = async () => {
  try {
    const items = await getWishlistItems();
    return items.length;
  } catch (e) {
    console.error('Error getting wishlist count:', e);
    return 0;
  }
};
