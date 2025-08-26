// App.js// App.tsx
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTap from "./src/Navigation/BottomTap";
import SlideBar from "./src/Navigation/SlideBar";
import { ms } from "react-native-size-matters";
import AddressPage from "./src/Screens/AddressPage";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import AddAddress from "./src/Screens/AddAddress";
import SubCategory from "./src/Screens/SubCategory";
import ProductDetails from "./src/Screens/ProductDetails";
import Cart from "./src/Screens/Cart";
import Login from "./src/Screens/Login";
import OtpScreen from "./src/Screens/OtpScreen";
import CheckoutScreen from "./src/Screens/CheckOut";
import Payment from "./src/Screens/Payment";
import OrderConfirm from "./src/Screens/OrderConfirm";
import Search from "./src/Screens/Search";
import About from "./src/Screens/SideDrawer/About";
import Contact from "./src/Screens/SideDrawer/Contact";
import Faq from "./src/Screens/SideDrawer/Faq";
import TermsAndConditions from "./src/Screens/SideDrawer/TermsAndConditions";
import PrivacyPolicy from "./src/Screens/SideDrawer/PrivacyPolicy";
import Notifications from "./src/Screens/SideDrawer/Notification";
import ShareApp from "./src/Screens/SideDrawer/ShareApp";
import TrackOrder from "./src/Screens/SideDrawer/TrackOrder";
import TrackOrderDetails from "./src/Screens/SideDrawer/TrackOrderDetails";
import Profile from "./src/Screens/Profile";
import EditProfile from "./src/Screens/EditProfile";
import FontTest from "./src/components/FontTest";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNav() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: ms(220),
          height: "100%",
          backgroundColor: "#f8f4f4ff",
        },
      }}
      drawerContent={(props) => <SlideBar {...props} />}
    >
      <Drawer.Screen name="Home" component={BottomTap} />
    </Drawer.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainDrawer"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MainDrawer" component={DrawerNav} />
        <Stack.Screen
          name="AddressPage"
          component={AddressPage}
        
        />
        <Stack.Screen name="AddAddress" component={AddAddress} />
        <Stack.Screen name="SubCategory" component={SubCategory} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />

        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{
            headerShown: true,
            title: "Payment",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="OrderConfirm"
          component={OrderConfirm}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="About"
          component={About}
          options={{
        
          }}
        />
        <Stack.Screen
          name="Contact"
          component={Contact}
          
        />
        <Stack.Screen
          name="FAQ"
          component={Faq}
         
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
        
        />

        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
       
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
        
        />
        <Stack.Screen
          name="ShareApp"
          component={ShareApp}
          options={{
            headerShown: true,
            title: "Share App",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="TrackOrder"
          component={TrackOrder}
         
        />
        <Stack.Screen
          name="TrackOrderDetails"
          component={TrackOrderDetails}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FontTest"
          component={FontTest}
          options={{
            headerShown: true,
            title: "Font Test",
            headerStyle: { backgroundColor: "red" },
            headerTintColor: "white",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
