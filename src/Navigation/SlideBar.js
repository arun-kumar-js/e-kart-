import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const SlideBar = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
   <FontAwesome5 name="user-circle" size={80} color="#fff" style={styles.logo} />
        <Text style={styles.loginText}>Login ?</Text>
      </View>

      <View style={styles.drawerList}>
        <DrawerItem
          icon={({ color, size }) => <Icon name="home-outline" color={color} size={size} />}
          label="Home"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => props.navigation.navigate('Home')}
        />
        <DrawerItem
          icon={({ color, size }) => <FontAwesome5 name="shopping-cart" color={color} size={size} />}
          label="Cart"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => <Icon name="notifications-outline" color={color} size={size} />}
          label="Notifications"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => <MaterialCommunityIcons name="truck-delivery-outline" color={color} size={size} />}
          label="Track Order"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => <MaterialCommunityIcons name="account-multiple-plus-outline" color={color} size={size} />}
          label="Refer & Earn"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => <Icon name="call-outline" color={color} size={size} />}
          label="Contact Us"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => <Icon name="information-circle-outline" color={color} size={size} />}
          label="About Us"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => <Icon name="star-outline" color={color} size={size} />}
          label="Rate Us"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => <Icon name="share-social-outline" color={color} size={size} />}
          label="Share App"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => <Icon name="help-circle-outline" color={color} size={size} />}
          label="FAQ"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => <Icon name="document-text-outline" color={color} size={size} />}
          label="Terms & Conditions"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => <Icon name="shield-checkmark-outline" color={color} size={size} />}
          label="Privacy Policy"
          labelStyle={{ fontFamily: 'Poppins' }}
          onPress={() => {}}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e60023',
    alignItems: 'center',
    paddingVertical: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  drawerList: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
});

export default SlideBar;