import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { WALLET, API_ACCESS_KEY } from "../../config/config";

type ListItemProps = {
  icon: string;
  label: string;
  onPress?: () => void;
};

const ListItem: React.FC<ListItemProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <Icon name={icon} size={24} color="#666" style={styles.listItemIcon} />
    <Text style={styles.listItemText}>{label}</Text>
  </TouchableOpacity>
);

const More = ({ navigation }: { navigation: any }) => {
  const [userData, setUserData] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) setUserData(JSON.parse(storedData));
      } catch (error) {
        console.log("Error loading userData:", error);
      }
    };
    loadUserData();
  }, []);

  // Fetch wallet balance from API
  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!userData || !userData.user_id) return;

      try {
        console.log(
          "💰 WALLET API CALL - Fetching wallet balance for user:",
          userData.user_id
        );

        const formData = new FormData();
        formData.append("accesskey", API_ACCESS_KEY);
        formData.append("get_user_data", "1");
        formData.append("user_id", userData.user_id);

        console.log("📤 WALLET API REQUEST:", {
          accesskey: API_ACCESS_KEY,
          get_user_data: "1",
          user_id: userData.user_id,
          endpoint: WALLET,
        });

        const response = await axios.post(WALLET, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ WALLET API SUCCESS:", {
          status: response.status,
          data: response.data,
          error: response.data?.error,
          balance: response.data?.balance,
        });

        if (
          response.data &&
          !response.data.error &&
          response.data.balance !== undefined
        ) {
          setWalletBalance(response.data.balance);
          console.log("💰 WALLET - Balance updated:", response.data.balance);
        }
      } catch (error: any) {
        console.error("❌ WALLET API ERROR:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          endpoint: WALLET,
        });
      }
    };
    fetchWalletBalance();
  }, [userData]);

  // Handle menu item navigation
  const handleMenuNavigation = (route: string) => {
    switch (route) {
      case "TrackOrder":
        navigation.navigate("TrackOrder");
        break;
      case "Notifications":
        navigation.navigate("Notifications");
        break;
      case "Contact":
        navigation.navigate("Contact");
        break;
      case "About":
        navigation.navigate("About");
        break;
      case "ShareApp":
        navigation.navigate("ShareApp");
        break;
      case "FAQ":
        navigation.navigate("FAQ");
        break;
      case "TermsAndConditions":
        navigation.navigate("TermsAndConditions");
        break;
      case "PrivacyPolicy":
        navigation.navigate("PrivacyPolicy");
        break;
      case "LogOut":
        // Show logout confirmation
        Alert.alert("Logout", "Do you want to logout?", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            style: "destructive",
            onPress: () => handleLogout(),
          },
        ]);
        break;
      case "RateUs":
        // Handle rate us (could open app store or show rating dialog)
        console.log("Rate Us pressed");
        break;
      case "ReferEarn":
        // Handle refer and earn (could show referral code or navigate to referral screen)
        console.log("Refer & Earn pressed");
        break;
      default:
        console.log("Unknown route:", route);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("cartItems");
      console.log("User logged out successfully");

      // Navigate to MainDrawer home page
      navigation.navigate("MainDrawer", { screen: "Home" });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const menuItems = [
    { icon: "shopping-bag", label: "My Orders", route: "TrackOrder" },
    { icon: "bell", label: "Notifications", route: "Notifications" },
    { icon: "phone", label: "Contact Us", route: "Contact" },
    { icon: "info-circle", label: "About Us", route: "About" },
    { icon: "star-o", label: "Rate Us", route: "RateUs" },
    { icon: "share-alt", label: "Share App", route: "ShareApp" },
    { icon: "users", label: "Refer & Earn", route: "ReferEarn" },
    { icon: "question-circle-o", label: "FAQ", route: "FAQ" },
    {
      icon: "file-text-o",
      label: "Terms & Conditions",
      route: "TermsAndConditions",
    },
    { icon: "shield", label: "Privacy Policy", route: "PrivacyPolicy" },
    { icon: "sign-out", label: "Log Out", route: "LogOut" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#EE2737" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* User Profile Section */}
          <View style={styles.profileContainer}>
            <View>
              <Text style={styles.profileName}>
                {userData?.name || "Guest User"}
              </Text>
              <Text style={styles.profileMobile}>
                {userData?.mobile || "0000000000"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                // Navigate to edit profile screen
                console.log("Edit Profile pressed");
                // You can add navigation to edit profile screen here
              }}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          {/* Wallet Section */}
          <View style={styles.walletBalanceContainer}>
            <Text style={styles.walletBalanceText}>Wallet Balance</Text>
            <Text style={styles.walletBalanceAmount}>
              <Text style={styles.walletCurrency}>RM </Text>
              {walletBalance}
            </Text>
          </View>

          {/* Menu Items */}
          <View style={styles.listContainer}>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                icon={item.icon}
                label={item.label}
                onPress={() => handleMenuNavigation(item.route)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EE2737" },
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContent: { paddingBottom: 80 },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EE2737", // changed to red
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // changed to white
    fontFamily: "Poppins",
  },
  profileMobile: {
    fontSize: 15,
    color: "#FFFFFF", // changed to white
    marginTop: 3,
    fontFamily: "Poppins",
  },
  editButton: {
    backgroundColor: "#FFFFFF", // changed to white to contrast with red
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#EE2737", // changed text to red for contrast
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  walletBalanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  walletBalanceText: {
    fontSize: 17,
    color: "#EE2737",
    fontFamily: "Poppins",
  },
  walletBalanceAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EE2737",
    fontFamily: "Poppins",
  },
  walletCurrency: {
    fontSize: 14,
    color: "#EE2737",
    fontFamily: "Poppins",
  },
  listContainer: { backgroundColor: "#FFFFFF" },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  listItemIcon: { width: 30, textAlign: "center" },
  listItemText: {
    fontSize: 17,
    color: "#333",
    marginLeft: 20,
    fontFamily: "Poppins",
  },
});

export default More;
