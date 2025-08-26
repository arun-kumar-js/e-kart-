import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { HOMEPAGE_ENDPOINT, API_ACCESS_KEY } from "../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CartButton from "../../Fuctions/CartButton";
import { getCartItemCount } from "../../Fuctions/CartService";

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const promotion = data?.section;

  //console.log('Fetched homepage data:', promotion);
  const fetchHomePageData = async () => {
    try {
      console.log("🏠 HOMEPAGE API CALL - Fetching homepage data");
      const formData = new FormData();
      formData.append("accesskey", API_ACCESS_KEY);

      console.log("📤 HOMEPAGE API REQUEST:", {
        accesskey: API_ACCESS_KEY,
        endpoint: HOMEPAGE_ENDPOINT,
      });

      const response = await axios.post(HOMEPAGE_ENDPOINT, formData);

      console.log("✅ HOMEPAGE API SUCCESS:", {
        status: response.status,
        error: response.data?.error,
        hasData: !!response.data?.data,
        categories_count: response.data?.data?.category?.length || 0,
        sections_count: response.data?.data?.section?.length || 0,
        slider_count: response.data?.data?.slider?.length || 0,
      });

      if (response.data && response.data.error === "false") {
        return response.data.data;
      } else {
        console.error("❌ HOMEPAGE API ERROR:", response.data);
        return null;
      }
    } catch (error) {
      console.error("❌ HOMEPAGE API EXCEPTION:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return null;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const res = await fetchHomePageData();
    if (res) {
      setData(res);
      setCategories(res.category || []);
      const prod =
        res.section?.[0]?.products?.map((p) => ({
          name: p.name,
          size: p.variants?.[0]?.measurement_unit_name || "",
          price: `₹${p.variants?.[0]?.product_price || ""}`,
          image: { uri: p.image },
        })) || [];
      setProducts(prod);
    }
    setRefreshing(false);
  };

  // Banner auto-slide state
  const bannerRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const count = await getCartItemCount();
      setCartCount(count);
    } catch (error) {
      console.log("Error fetching cart count:", error);
    }
  };

  // Banner auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!data?.slider || data.slider.length === 0) return;
      const nextIndex = (currentBannerIndex + 1) % data.slider.length;
      bannerRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentBannerIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentBannerIndex, data?.slider]);

  // Fetch user's default address
  const fetchUserAddress = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setUser(userObj);

        console.log(
          "🏠 HOME USER ADDRESS API CALL - Fetching address for user:",
          userObj.user_id
        );

        const formData = new FormData();
        formData.append("user_id", userObj.user_id);
        formData.append("accesskey", API_ACCESS_KEY);
        formData.append("type", "list_address");

        console.log("📤 HOME USER ADDRESS API REQUEST:", {
          user_id: userObj.user_id,
          accesskey: API_ACCESS_KEY,
          type: "list_address",
        });

        const response = await axios.post(
          "https://spiderekart.in/ec_service/api-firebase/user_addresses.php",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("✅ HOME USER ADDRESS API SUCCESS:", {
          status: response.status,
          addresses_count: response.data?.data?.length || 0,
          hasAddresses: !!response.data?.data?.length,
        });

        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          // Set the first address as default
          setSelectedAddress(response.data.data[0]);
          console.log("📍 HOME - Set default address:", response.data.data[0]);
        }
      } else {
        console.log("⚠️ HOME - No user data found in AsyncStorage");
      }
    } catch (error) {
      console.error("❌ HOME USER ADDRESS API ERROR:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchHomePageData();
      if (res) {
        setData(res);
        setCategories(res.category || []);
        const prod =
          res.section?.[0]?.products?.map((p) => ({
            name: p.name,
            size: p.variants?.[0]?.measurement_unit_name || "",
            price: `₹${p.variants?.[0]?.product_price || ""}`,
            image: { uri: p.image },
          })) || [];
        setProducts(prod);
      }
      // Fetch user address after homepage data
      await fetchUserAddress();
    };
    loadData();
  }, []);

  // Refresh address when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserAddress();
      fetchCartCount();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <>
        {/* Header - fixed */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: wp("3.5%") }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon name="menu" size={wp("6%")} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: wp("2.5%"),
            }}
          >
            <TouchableOpacity
              style={styles.addressContainer}
              onPress={() => {
                if (user && user.user_id) {
                  navigation.navigate("AddressPage");
                } else {
                  // Handle case when user is not logged in
                  Alert.alert(
                    "Login Required",
                    "Please login to manage addresses"
                  );
                }
              }}
            >
              <Image
                source={require("../../Assets/Images/Edit.png")}
                style={{
                  width: wp("4%"),
                  height: hp("2%"),
                  tintColor: "#fff",
                  marginLeft: wp("10%"),
                  marginRight: wp("4%"),
                }}
              />
              <View style={styles.addressTextContainer}>
                <Text style={styles.locationText}>
                  {selectedAddress
                    ? `${selectedAddress.state_name}, ${selectedAddress.pincode}`
                    : "Choose Location"}
                </Text>
                {selectedAddress && (
                  <Text style={styles.addressSubText}>
                    {selectedAddress.street}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.editIconContainer}
                onPress={() => {
                  if (user && user.user_id && selectedAddress) {
                    navigation.navigate("AddAddress", {
                      user_id: user.user_id,
                      addressData: selectedAddress,
                    });
                  } else if (!user || !user.user_id) {
                    Alert.alert(
                      "Login Required",
                      "Please login to edit addresses"
                    );
                  } else {
                    Alert.alert("No Address", "Please add an address first");
                  }
                }}
              ></TouchableOpacity>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Cart")}
            style={styles.cartContainer}
          >
            <Icon name="cart-outline" size={wp("6%")} color="#fff" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* Search Bar - fixed */}
        <TouchableOpacity
          style={styles.searchWrapper}
          onPress={() => navigation.navigate("Search")}
          activeOpacity={0.8}
        >
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={wp("5%")}
              color="#888"
              style={styles.searchIcon}
            />
            <Text style={styles.searchInput}>Search products..</Text>
          </View>
        </TouchableOpacity>
      </>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <>
            {/* Banner */}
            <View style={{ overflow: "hidden", marginTop: 0 }}>
              <FlatList
                data={data?.slider}
                ref={bannerRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                keyExtractor={(item, index) => index.toString()}
                onScroll={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x /
                      e.nativeEvent.layoutMeasurement.width
                  );
                  setCurrentBannerIndex(index);
                }}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.banner}
                    resizeMode="cover"
                  />
                )}
              />
              <View style={styles.dotContainer}>
                {data?.slider?.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      currentBannerIndex === i && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>
            {/* Promotion Section */}
            {data?.section
              ?.filter(
                (item) => item.title === "PROMOTION" && item.place === "top"
              )
              .map((promo, index) => (
                <View key={promo.id}>
                  <Text style={styles.sectionTitle}>Promotion</Text>
                  <View
                    style={{
                      marginHorizontal: wp("4%"),
                      marginVertical: hp("1%"),
                      padding: wp("3%"),
                      backgroundColor:
                        promo.style === "style_1" ? "#f9fbfcff" : "#f6f7f7ff",
                      borderRadius: wp("2%"),
                    }}
                  >
                    <FlatList
                      data={promo.products}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, idx) => idx.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            //console.log('Promotion item clicked:', { product: item });
                            navigation.navigate("ProductDetails", {
                              product: item,
                            });
                          }}
                          activeOpacity={0.85}
                        >
                          <View
                            style={{
                              width: wp("40%"),
                              marginRight: wp("3%"),
                              backgroundColor: "#edececff",
                              borderRadius: wp("2%"),
                              overflow: "hidden",
                              elevation: 2,
                            }}
                          >
                            <Image
                              source={{ uri: item.image }}
                              style={{
                                width: "100%",
                                height: hp("20%"),
                                resizeMode: "cover",
                              }}
                            />
                            <Text
                              style={{ padding: wp("2%"), fontWeight: "500" }}
                            >
                              {item.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingHorizontal: wp("2%"),
                                marginBottom: hp("0.5%"),
                              }}
                            >
                              <Text
                                style={{
                                  color: "#888",
                                  fontSize: wp("3%"),
                                  flex: 1,
                                }}
                              >
                                1 Pc
                              </Text>
                              <Text
                                style={{
                                  color: "green",
                                  fontWeight: "bold",
                                  fontSize: wp("3.5%"),
                                  textAlign: "right",
                                }}
                              >
                                RM{item?.variants?.[0]?.product_price || ""}
                              </Text>
                            </View>
                            <View
                              style={{
                                margin: wp("2%"),
                                width: wp("36%"),
                                height: hp("6%"),
                              }}
                            >
                              <CartButton
                                product={item}
                                onChange={(quantity) => {
                                  console.log(
                                    `Product ${item.name} quantity: ${quantity}`
                                  );
                                }}
                                showPromotion={true}
                                onPromotionPress={() => {
                                  console.log(
                                    `Promotion applied to ${item.name}`
                                  );
                                  // Add your promotion logic here
                                }}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              ))}

            <Text style={styles.sectionTitle}>Category</Text>
            <FlatList
              data={categories}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingHorizontal: wp("2%"),
                paddingBottom: hp("1.5%"),
              }}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: hp("1.5%"),
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => {
                    navigation.navigate("SubCategory", {
                      category_id: item.id,
                      subcategory_id:
                        data?.section?.[0]?.products?.[0]?.subcategory_id,
                      category_name: item.name,
                    });
                  }}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cardImage}
                    />
                  ) : (
                    <View style={styles.placeholderCircle} />
                  )}
                  <Text style={styles.cardText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <Text style={styles.sectionTitle}>New arrival products</Text>
            <FlatList
              data={products}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                paddingHorizontal: wp("2%"),
                paddingBottom: hp("1.5%"),
              }}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: hp("1.5%"),
              }}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <Image source={item.image} style={styles.cardImage} />
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productSize}>{item.size}</Text>
                  <Text style={styles.productPrice}>
                    {item.price.replace("RM", "RM")}
                  </Text>
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        }
        renderItem={null}
      />
    </SafeAreaView>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#e60023",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: hp("8%"),
  },
  locationText: {
    color: "#fff",
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: wp("3.5%"),
    lineHeight: wp("5.1%"),
    letterSpacing: 0,
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: wp("2%"),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("2%"),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "100%", // fill searchWrapper width
  },
  searchInput: {
    flex: 1,
    height: hp("5%"),
    fontSize: wp("3.5%"),
    textAlign: "left",
    color: "#888",
    paddingTop: hp("1.5%"),
  },
  searchIcon: {
    marginHorizontal: wp("2%"),
  },
  categoryScroll: {
    marginTop: hp("1.5%"),
    paddingHorizontal: wp("2%"),
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: wp("2%"),
  },
  categoryCircle: {
    width: wp("15%"),
    height: wp("15%"),
    borderRadius: wp("7.5%"),
    overflow: "hidden",
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderCircle: {
    width: wp("15%"),
    height: wp("15%"),
    backgroundColor: "#ccc",
    borderRadius: wp("7.5%"),
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  banner: {
    width: screenWidth - wp("8%"), // total width minus combined horizontal margin
    height: hp("25%"),
    borderRadius: wp("3.5%"),
    marginHorizontal: wp("4%"), // same as search wrapper
    overflow: "hidden",
    marginTop: hp("1%"),
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    marginHorizontal: wp("4%"),
    marginTop: hp("2.5%"),
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  productCard: {
    width: wp("35%"),
    borderRadius: wp("3%"),
    backgroundColor: "#fff",
    elevation: 2,
    marginRight: wp("3%"),
    padding: wp("2%"),
    alignItems: "center",
  },
  productImage: {
    width: wp("20%"),
    height: wp("20%"),
    resizeMode: "contain",
  },
  productName: {
    fontSize: wp("3.3%"),
    fontWeight: "500",
    textAlign: "center",
    marginTop: hp("1%"),
  },
  productSize: {
    fontSize: wp("3%"),
    color: "#888",
    marginTop: hp("0.5%"),
  },
  productPrice: {
    fontSize: wp("3.5%"),
    color: "green",
    fontWeight: "bold",
    marginTop: hp("0.5%"),
  },
  addButton: {
    backgroundColor: "#e60023",
    paddingVertical: hp("0.7%"),
    paddingHorizontal: wp("6%"),
    borderRadius: wp("1.5%"),
    marginTop: hp("1%"),
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("3.3%"),
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  dot: {
    width: wp("2%"),
    height: wp("2%"),
    borderRadius: wp("1%"),
    backgroundColor: "#ccc",
    marginHorizontal: wp("1%"),
  },
  activeDot: {
    backgroundColor: "#e60023",
  },
  cardContainer: {
    margin: wp("2.5%"),
    width: "45%",
    height: "auto",
    backgroundColor: "#fff",
    borderRadius: wp("3%"),
    overflow: "hidden",
    marginBottom: hp("1.5%"),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    alignItems: "center",
    paddingBottom: hp("1.5%"),
  },
  cardImage: {
    width: "100%",
    height: hp("25%"),
    resizeMode: "cover",
  },
  cardText: {
    fontSize: wp("3.3%"),
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("1%"),
    color: "#333",
  },
  searchWrapper: {
    backgroundColor: "#e60023",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"), // same as banner margin
  },
  fontTestButton: {
    backgroundColor: "#007AFF",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("1%"),
    marginHorizontal: wp("4%"),
    marginTop: hp("1%"),
    borderRadius: wp("2%"),
    alignItems: "center",
  },
  fontTestButtonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1.5%"),
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("2%"),
    minHeight: hp("4%"),
  },
  editIconContainer: {
    padding: wp("1%"),
  },
  addressTextContainer: {
    flex: 1,
  },
  addressSubText: {
    fontSize: wp("2.8%"),
    color: "#fff",
    marginTop: hp("0.2%"),
  },
  cartContainer: {
    position: "absolute",
    top: hp("2%"),
    right: wp("4%"),
    padding: wp("1%"),
    minWidth: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  cartBadge: {
    position: "absolute",
    top: -wp("1%"),
    right: -wp("1%"),
    backgroundColor: "#e60023",
    borderRadius: wp("2%"),
    minWidth: wp("4%"),
    height: wp("4%"),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("0.5%"),
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: wp("1.8%"),
    fontWeight: "bold",
  },
});
