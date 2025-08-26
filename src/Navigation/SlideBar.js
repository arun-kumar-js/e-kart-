import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import axios from "axios";
import { DELETE_USER, API_ACCESS_KEY } from "../config/config";

import HomeIcon from "../Assets/icon/home.png";
import CartIcon from "../Assets/icon/cart.png";
import NotificationIcon from "../Assets/icon/bell.png";
import TrackOrderIcon from "../Assets/icon/track.png";
import ReferIcon from "../Assets/icon/refer.png";
import ContactIcon from "../Assets/icon/phone.png";
import AboutIcon from "../Assets/icon/about.png";
import RateIcon from "../Assets/icon/star.png";
import ShareIcon from "../Assets/icon/share.png";
import FAQIcon from "../Assets/icon/FAQ.png";
import TermsIcon from "../Assets/icon/terms.png";
import PrivacyIcon from "../Assets/icon/privacy.png";
// Remove image-based icons for Logout and Delete Account
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
const SlideBar = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user", e);
      }
    };
    loadUser();
  }, []);

  const deleteAccount = async () => {
    try {
      if (!user || !user.user_id) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const formData = new FormData();
      formData.append("accesskey", API_ACCESS_KEY);
      formData.append("type", "delete_user");
      formData.append("user_id", user.user_id);

      const response = await axios.post(DELETE_USER, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && !response.data.error) {
        Alert.alert("Success", "Account deleted successfully", [
          {
            text: "OK",
            onPress: async () => {
              await AsyncStorage.removeItem("userData");
              props.navigation.replace("Home");
            },
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to delete account"
        );
      }
    } catch (error) {
      console.error("Delete account error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          {user ? (
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("Profile", { userData: user })
                }
                style={styles.profileImageContainer}
              >
                {user.profile_image ? (
                  <Image
                    source={{ uri: user.profile_image }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.defaultProfileImage}>
                    <Text style={styles.profileInitial}>
                      {(user.name || user.user_name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.loginText}>
                {user.name || user.user_name || "User"}
              </Text>
              <Text style={styles.phoneText}>{user.mobile || ""}</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>Login ?</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.drawerList}>
          <DrawerItem
            icon={() => (
              <Image source={HomeIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Home"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("Home")}
          />
          <DrawerItem
            icon={() => (
              <Image source={CartIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Cart"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("Cart")}
          />
          <DrawerItem
            icon={() => (
              <Ionicons name="person-outline" size={24} color="#000" />
            )}
            label="Profile"
            labelStyle={styles.textCommon}
            onPress={() =>
              props.navigation.navigate("Profile", { userData: user })
            }
          />
          <DrawerItem
            icon={() => (
              <Image
                source={NotificationIcon}
                style={{ width: 24, height: 24 }}
              />
            )}
            label="Notifications"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("Notifications")}
            style={{ marginBottom: 10 }}
          />
          {/* Spacing after Notifications and before Track Order */}
          <View
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginVertical: 10,
            }}
          />
          <DrawerItem
            icon={() => (
              <Image
                source={TrackOrderIcon}
                style={{ width: 24, height: 24 }}
              />
            )}
            label="Track Order"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("TrackOrder")}
          />
          <DrawerItem
            icon={() => (
              <Image source={ReferIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Refer & Earn"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("Refer & Earn")}
            style={{ marginBottom: 10 }}
          />
          {/* Spacing after Refer & Earn and before Contact */}
          <View
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginVertical: 10,
            }}
          />
          <DrawerItem
            icon={() => (
              <Image source={ContactIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Contact"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("Contact")}
          />
          <DrawerItem
            icon={() => (
              <Image source={AboutIcon} style={{ width: 24, height: 24 }} />
            )}
            label="About Us"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("About")}
          />
          <DrawerItem
            icon={() => (
              <Image source={RateIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Rate Us"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("Rate Us")}
          />
          <DrawerItem
            icon={() => (
              <Image source={ShareIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Share App"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("ShareApp")}
            style={{ marginBottom: 10 }}
          />
          {/* Spacing after Share App and before FAQ */}
          <View
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginVertical: 10,
            }}
          />
          <DrawerItem
            icon={() => (
              <Image source={FAQIcon} style={{ width: 24, height: 24 }} />
            )}
            label="FAQ"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("FAQ")}
          />
          <DrawerItem
            icon={() => (
              <Image source={TermsIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Terms & Conditions"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("TermsAndConditions")}
          />
          <DrawerItem
            icon={() => (
              <Image source={PrivacyIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Privacy Policy"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate("PrivacyPolicy")}
          />
          {/* Spacing after Privacy Policy and before Logout/Logo section */}
          <View
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginVertical: 10,
            }}
          />
          <DrawerItem
            icon={() => (
              <Ionicons name="log-out-outline" size={24} color="#000" />
            )}
            label="Logout"
            labelStyle={styles.textCommon}
            onPress={async () => {
              await AsyncStorage.removeItem("userData");
              props.navigation.replace("Login");
            }}
          />
          <DrawerItem
            icon={() => (
              <MaterialIcons name="delete-outline" size={24} color="red" />
            )}
            label="Delete Account"
            labelStyle={[styles.textCommon, { color: "red" }]}
            onPress={() => {
              Alert.alert(
                "Delete Account",
                "Do you want to delete? You will lost your data",
                [
                  { text: "No", style: "cancel" },
                  {
                    text: "Yes",
                    style: "destructive",
                    onPress: deleteAccount,
                  },
                ]
              );
            }}
          />
        </View>
      </ScrollView>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FF0000",
    alignItems: "center",
    paddingVertical: 30,
  },
  profileImageContainer: {
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  defaultProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF0000",
  },
  textCommon: {
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    textTransform: "capitalize",
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  drawerList: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  phoneText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins",
    marginTop: 4,
  },
});

export default SlideBar;
