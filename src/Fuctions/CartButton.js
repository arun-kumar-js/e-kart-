import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  updateCartItem,
  getProductQuantity,
  increaseProductQuantity,
  decreaseProductQuantity,
} from "./CartService";
import { onCartUpdated, offCartUpdated } from "./cartEvents";

const CartButton = ({
  product,
  initialQuantity = 0,
  onChange,
  tax = 0,
  size = "default",
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  // Debug log for quantity changes
  useEffect(() => {
    console.log("CartButton quantity changed:", quantity);
  }, [quantity]);

  useEffect(() => {
    const fetchQuantity = async () => {
      try {
        const productId = product.id ?? product.product_id;
        if (!productId) {
          console.warn("Invalid product id:", product);
          return;
        }
        const currentQuantity = await getProductQuantity(productId);
        setQuantity(currentQuantity);
        onChange?.(currentQuantity);
      } catch (error) {
        console.error("Error fetching product quantity:", error);
      }
    };

    fetchQuantity();

    // Listen for cart updates
    const listener = () => fetchQuantity();
    onCartUpdated(listener);

    return () => {
      offCartUpdated(listener);
    };
  }, [product, onChange]);

  const updateQuantity = async (newQty) => {
    try {
      // Allow quantity to go to 0 for proper state management
      if (newQty < 0) {
        newQty = 0;
      }

      const updatedQty = await updateCartItem(product, newQty);
      setQuantity(updatedQty);
      onChange?.(updatedQty);
      console.log("Update quantity result:", {
        requested: newQty,
        actual: updatedQty,
      });
    } catch (error) {
      console.warn("Failed to update cart item:", error);
    }
  };

  const handleIncrease = async () => {
    try {
      const newQty = await increaseProductQuantity(product);
      setQuantity(newQty);
      onChange?.(newQty);
    } catch (error) {
      console.warn("Failed to increase quantity:", error);
    }
  };

  const handleDecrease = async () => {
    try {
      const newQty = await decreaseProductQuantity(product);
      // Ensure quantity doesn't go below 0
      const finalQty = Math.max(0, newQty);
      setQuantity(finalQty);
      onChange?.(finalQty);
      console.log("Decrease result:", { original: newQty, final: finalQty });

      // If quantity becomes 0, the UI will automatically switch to Add button
      if (finalQty === 0) {
        console.log("Quantity reached 0, switching to Add button");
      }
    } catch (error) {
      console.warn("Failed to decrease quantity:", error);
    }
  };

  const handleRemove = async () => {
    try {
      // Set quantity to 0 to remove item completely
      await updateQuantity(0);
      console.log("Item removed from cart");
    } catch (error) {
      console.warn("Failed to remove item:", error);
    }
  };

  // Get styles based on size
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          cartContainer: {
            height: hp("4%"),
            paddingHorizontal: wp("1.5%"),
          },
          quantityButton: {
            paddingHorizontal: wp("2%"),
            paddingVertical: hp("0.7%"),
          },
          quantityButtonText: {
            fontSize: wp("3.5%"),
          },
          countBox: {
            paddingHorizontal: wp("2%"),
            paddingVertical: hp("1%"),
            minWidth: wp("8%"),
          },
          countText: {
            fontSize: wp("3%"),
          },
          addButton: {
            paddingVertical: hp("1.4%"),
          },
          addButtonText: {
            fontSize: wp("3%"),
          },
        };
      case "large":
        return {
          cartContainer: {
            height: hp("6%"),
            paddingHorizontal: wp("3%"),
          },
          quantityButton: {
            paddingHorizontal: wp("4%"),
            paddingVertical: hp("1.2%"),
          },
          quantityButtonText: {
            fontSize: wp("5.5%"),
          },
          countBox: {
            paddingHorizontal: wp("4%"),
            paddingVertical: hp("2%"),
            minWidth: wp("12%"),
          },
          countText: {
            fontSize: wp("5%"),
          },
          addButton: {
            paddingVertical: hp("2.2%"),
          },
          addButtonText: {
            fontSize: wp("5%"),
          },
        };
      default:
        return {
          cartContainer: {},
          quantityButton: {},
          quantityButtonText: {},
          countBox: {},
          countText: {},
          addButton: {},
          addButtonText: {},
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={{ flex: 1 }}>
      {quantity > 0 ? (
        <View style={[styles.cartContainer, sizeStyles.cartContainer]}>
          <TouchableOpacity
            style={[styles.quantityButton, sizeStyles.quantityButton]}
            onPress={handleDecrease}
            onLongPress={handleRemove}
          >
            <Text
              style={[styles.quantityButtonText, sizeStyles.quantityButtonText]}
            >
              -
            </Text>
          </TouchableOpacity>
          <View style={[styles.countBox, sizeStyles.countBox]}>
            <Text style={[styles.countText, sizeStyles.countText]}>
              {quantity}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.quantityButton, sizeStyles.quantityButton]}
            onPress={handleIncrease}
          >
            <Text
              style={[styles.quantityButtonText, sizeStyles.quantityButtonText]}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={[styles.addButton, sizeStyles.addButton]}
            onPress={() => updateQuantity(1)}
          >
            <Text style={[styles.addButtonText, sizeStyles.addButtonText]}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F70D24",
    borderRadius: wp("2%"),
    height: hp("5%"),
    paddingHorizontal: wp("2%"),
    marginBottom: wp("2%"),
  },
  quantityButton: {
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.9%"),
  },
  quantityButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("4.5%"),
  },
  countBox: {
    backgroundColor: "#fff",
    // borderRadius: wp('1%'),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1.5%"),
    marginHorizontal: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
    minWidth: wp("10%"),
  },
  countText: {
    color: "#F70D24",
    fontWeight: "bold",
    fontSize: wp("4%"),
    textAlign: "center",
  },
  addButtonContainer: {
    flexDirection: "row",
    gap: wp("2%"),
  },
  addButton: {
    backgroundColor: "#F70D24",
    borderRadius: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp("1.8%"),
    flex: 1,
  },
  addButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
});

export default CartButton;
