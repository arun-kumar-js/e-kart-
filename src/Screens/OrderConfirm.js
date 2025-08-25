import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { clearCart } from "../DataBase/CartDB";

const OrderConfirm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, totalAmount } = route.params || {};

  // Clear cart items when order is confirmed
  useEffect(() => {
    const clearCartItems = async () => {
      try {
        await clearCart();
        console.log("✅ Cart cleared successfully after order confirmation");
      } catch (error) {
        console.error("❌ Error clearing cart:", error);
      }
    };

    clearCartItems();
  }, []);

  const handleContinueShopping = () => {
    navigation.navigate("MainDrawer");
  };

  const handleViewOrderDetails = () => {
    // Navigate to order details or orders list
    navigation.navigate("MainDrawer");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E81618" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={wp("6%")} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order placed</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Success Title */}

        {/* Package Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../Assets/Images/confirm.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContinueShopping}
        >
          <Text style={styles.primaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleViewOrderDetails}
        >
          <Text style={styles.secondaryButtonText}>View Order Details</Text>
        </TouchableOpacity>

        {/* Order Info */}
        {orderId && (
          <View style={styles.orderInfo}>
            {/* <Text style={styles.orderInfoText}>Order ID: {orderId}</Text> */}
            {/* {totalAmount && ( */}
            {/* <Text style={styles.orderInfoText}>Total: RM {totalAmount}</Text> */}
            {/* )} */}
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../Assets/Images/spider.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#E81618",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
  },
  backButton: {
    padding: wp("2%"),
  },
  headerTitle: {
    color: "#fff",
    fontSize: wp("5%"),
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  headerPlaceholder: {
    width: wp("10%"),
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: wp("8%"),
    paddingTop: hp("8%"),
  },
  title: {
    fontSize: wp("8%"),
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: hp("1%"),
  },
  subtitle: {
    fontSize: wp("4%"),
    color: "#666",
    textAlign: "center",
    marginBottom: hp("6%"),
  },
  illustrationContainer: {
    marginBottom: hp("8%"),
    alignItems: "center",
  },
  illustration: {
    width: wp("60%"),
    height: hp("25%"),
  },
  primaryButton: {
    backgroundColor: "#E81618",
    paddingHorizontal: wp("12%"),
    paddingVertical: hp("2.5%"),
    borderRadius: wp("8%"),
    marginBottom: hp("3%"),
    elevation: 3,
    shadowColor: "#E81618",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    paddingVertical: hp("1%"),
  },
  secondaryButtonText: {
    color: "#E81618",
    fontSize: wp("4%"),
    fontWeight: "500",
    textAlign: "center",
  },
  orderInfo: {
    marginTop: hp("4%"),
    alignItems: "center",
  },
  orderInfoText: {
    fontSize: wp("3.5%"),
    color: "#666",
    marginBottom: hp("0.5%"),
  },
  footer: {
    alignItems: "center",
    paddingBottom: hp("3%"),
  },
  poweredByText: {
    fontSize: wp("3%"),
    color: "#999",
    marginBottom: hp("1%"),
  },
  logoContainer: {
    alignItems: "center",
  },
  logoImage: {
    width: wp("40%"),
    height: hp("15%"),
  },
});

export default OrderConfirm;
