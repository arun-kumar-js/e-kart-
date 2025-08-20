// App.js// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTap from './src/Navigation/BottomTap';
import SlideBar from './src/Navigation/SlideBar';
import { ms } from 'react-native-size-matters';
import AddressPage from './src/Screens/AddressPage';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import AddAddress from './src/Screens/AddAddress';
import SubCategory from './src/Screens/SubCategory';
import ProductDetails from './src/Screens/ProductDetails';
import Cart from './src/Screens/Cart';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNav() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: ms(240) },
      }}
      drawerContent={props => <SlideBar {...props} />}
    >
      <Drawer.Screen name="Home" component={BottomTap} />
    </Drawer.Navigator>
  );
}

const App=()=> {
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
          options={{
            headerShown: true,
            title: 'Choose Address',
            headerStyle: { backgroundColor: 'red' },
          }}
        />
        <Stack.Screen name="AddAddress" component={AddAddress} />
        <Stack.Screen name="SubCategory" component={SubCategory} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="Cart" component={Cart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
