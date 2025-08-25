import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonTextStyles } from "../../config/globalStyles";
import {
  getWishlistItems,
  removeFromWishlist,
} from "../../DataBase/WishlistDB";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface WishlistItem {
  id?: string;
  product_id?: string;
  name: string;
  image: string;
  price: string;
  rating?: string;
  rating_count?: string;
  variants?: Array<{
    product_price: string;
    measurement_unit_name: string;
  }>;
  added_at?: string;
}

const WishList = ({ navigation }: { navigation: any }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist items from database
  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const items = await getWishlistItems();
      setWishlistItems(items);
      console.log("Wishlist items fetched:", items);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId: string) => {
    Alert.alert(
      "Remove from Wishlist",
      "Are you sure you want to remove this item from your wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await removeFromWishlist(productId);
              if (success) {
                // Remove from local state
                setWishlistItems((prev) =>
                  prev.filter(
                    (item) =>
                      item.id !== productId && item.product_id !== productId
                  )
                );
                console.log("Item removed from wishlist");
              }
            } catch (error) {
              console.error("Error removing from wishlist:", error);
            }
          },
        },
      ]
    );
  };

  // Navigate to product details
  const handleProductPress = (product: WishlistItem) => {
    navigation.navigate("ProductDetails", { product });
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const renderWishlistItem = ({ item }: { item: WishlistItem }) => {
    const productId = (item.id ?? item.product_id) || "default";
    const originalPrice = Number(item.price);
    const salePrice = Number(item.variants?.[0]?.product_price ?? item.price);
    const hasDiscount = originalPrice !== salePrice;
    const discountPercent = hasDiscount
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => handleProductPress(item)}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{item.rating || "0"}</Text>
              <Text style={styles.star}>★</Text>
            </View>
            <Text style={styles.ratingCount}>
              {item.rating_count || "N/A"} Ratings
            </Text>
          </View>

          <View style={styles.quantityBox}>
            <Text style={styles.quantityText}>
              Qty: {item?.variants?.[0]?.measurement_unit_name || "N/A"}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            {hasDiscount && (
              <Text style={styles.originalPrice}>RM {item.price}</Text>
            )}
            <Text style={styles.salePrice}>
              RM {item.variants?.[0]?.product_price ?? item.price}
            </Text>
            {hasDiscount && (
              <Text style={styles.discountBadge}>{discountPercent}% OFF</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromWishlist(productId)}
        >
          <Ionicons name="close-circle" size={24} color="#F70D24" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.loadingText}>Loading wishlist...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => (item.id ?? item.product_id) || "default"}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Start adding products to your wishlist to see them here
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate("MainDrawer")}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default WishList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("4%"),
    backgroundColor: "#e60023",
    width: "100%",
  },
  headerTitle: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  headerPlaceholder: {
    width: wp("10%"),
  },
  listContainer: {
    padding: wp("3%"),
  },
  productCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    marginBottom: hp("2%"),
    flexDirection: "row",
    elevation: 2,
    position: "relative",
  },
  productImage: {
    width: wp("25%"),
    height: hp("18%"),
    borderRadius: wp("2%"),
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
    marginLeft: wp("3%"),
    justifyContent: "space-between",
  },
  productName: {
    fontWeight: "700",
    fontSize: wp("4%"),
    marginBottom: hp("1%"),
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  ratingBadge: {
    flexDirection: "row",
    backgroundColor: "#f16774ff",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.3%"),
    borderRadius: wp("1%"),
    alignItems: "center",
  },
  ratingText: {
    fontSize: wp("2.5%"),
    color: "#fff",
    marginRight: wp("0.5%"),
  },
  star: {
    fontSize: wp("2.5%"),
    color: "#fff",
  },
  ratingCount: {
    fontSize: wp("2.5%"),
    color: "#666",
    marginLeft: wp("2%"),
  },
  quantityBox: {
    borderWidth: 1,
    borderColor: "#f5f5f5",
    borderRadius: wp("2%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("2%"),
    backgroundColor: "#f5f5f5",
    alignSelf: "flex-start",
    marginBottom: hp("1%"),
  },
  quantityText: {
    fontSize: wp("3%"),
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  originalPrice: {
    fontSize: wp("3%"),
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: wp("2%"),
  },
  salePrice: {
    fontWeight: "bold",
    fontSize: wp("3.5%"),
    color: "#039809",
    marginRight: wp("2%"),
  },
  discountBadge: {
    backgroundColor: "green",
    color: "#fff",
    fontSize: wp("2.5%"),
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.3%"),
    borderRadius: wp("1%"),
    fontWeight: "bold",
  },
  removeButton: {
    position: "absolute",
    top: wp("2%"),
    right: wp("2%"),
    padding: wp("1%"),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: wp("4%"),
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("10%"),
  },
  emptyTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#333",
    marginTop: hp("3%"),
    marginBottom: hp("1%"),
  },
  emptySubtitle: {
    fontSize: wp("3.5%"),
    color: "#666",
    textAlign: "center",
    marginBottom: hp("4%"),
    lineHeight: hp("5%"),
  },
  browseButton: {
    backgroundColor: "#F70D24",
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
  },
  browseButtonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
});
