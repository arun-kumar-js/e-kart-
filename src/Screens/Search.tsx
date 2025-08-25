import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SEARCH_PRODUCTS, API_ACCESS_KEY } from "../config/config";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface SearchResult {
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
}

const Search = ({ navigation }: { navigation: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Search products API
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setSearching(true);
      setHasSearched(true);

      const formData = new FormData();
      formData.append("type", "products-search");
      formData.append("accesskey", API_ACCESS_KEY);
      formData.append("search", query);

      console.log("SEARCH API CALL - Query:", query);
      console.log("SEARCH API REQUEST - FormData:", {
        type: "products-search",
        accesskey: API_ACCESS_KEY,
        search: query,
      });

      const response = await axios.post(SEARCH_PRODUCTS, formData);

      console.log("SEARCH API SUCCESS - Response:", response.data);

      if (response.data && response.data.data) {
        setSearchResults(response.data.data);
        console.log("Search results:", response.data.data);
      } else {
        setSearchResults([]);
        console.log("No search results found");
      }
    } catch (error) {
      console.error("SEARCH API ERROR:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      // Search as user types (with debounce)
      const timeoutId = setTimeout(() => {
        searchProducts(text);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  // Navigate to product details
  const handleProductPress = (product: SearchResult) => {
    navigation.navigate("ProductDetails", { product });
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    const productId = item.id ?? item.product_id;
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
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Products</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery("");
                setSearchResults([]);
                setHasSearched(false);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      {searching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F70D24" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : hasSearched ? (
        searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => (item.id ?? item.product_id) || "default"}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with different keywords
            </Text>
          </View>
        )
      ) : (
        <View style={styles.initialContainer}>
          <Ionicons name="search-outline" size={80} color="#ccc" />
          <Text style={styles.initialTitle}>Search Products</Text>
          <Text style={styles.initialSubtitle}>
            Enter a product name to start searching
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Search;

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
  searchContainer: {
    padding: wp("3%"),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
  },
  searchIcon: {
    marginRight: wp("2%"),
  },
  searchInput: {
    flex: 1,
    fontSize: wp("4%"),
    color: "#333",
  },
  clearButton: {
    padding: wp("1%"),
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: wp("4%"),
    color: "#666",
    marginTop: hp("2%"),
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
    lineHeight: hp("5%"),
  },
  initialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("10%"),
  },
  initialTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#333",
    marginTop: hp("3%"),
    marginBottom: hp("1%"),
  },
  initialSubtitle: {
    fontSize: wp("3.5%"),
    color: "#666",
    textAlign: "center",
    lineHeight: hp("5%"),
  },
});
