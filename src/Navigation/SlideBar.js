import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import HomeIcon from '../Assets/icon/home.png';
import CartIcon from '../Assets/icon/cart.png';
import NotificationIcon from '../Assets/icon/bell.png';
import TrackOrderIcon from '../Assets/icon/track.png';
import ReferIcon from '../Assets/icon/refer.png';
import ContactIcon from '../Assets/icon/phone.png';
import AboutIcon from '../Assets/icon/about.png';
import RateIcon from '../Assets/icon/star.png';
import ShareIcon from '../Assets/icon/share.png';
import FAQIcon from '../Assets/icon/FAQ.png';
import TermsIcon from '../Assets/icon/terms.png';
import PrivacyIcon from '../Assets/icon/privacy.png';
// Remove image-based icons for Logout and Delete Account
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const SlideBar = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load user', e);
      }
    };
    loadUser();
  }, []);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          {user ? (
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../Assets/Images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.loginText}>{user.name || 'User'}</Text>
              <Text style={styles.phoneText}>{user.mobile || ''}</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
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
            onPress={() => props.navigation.navigate('Home')}
          />
          <DrawerItem
            icon={() => (
              <Image source={CartIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Cart"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate('Cart')}
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
            onPress={() => props.navigation.navigate('Notifications')}
            style={{ marginBottom: 10 }}
          />
          {/* Spacing after Notifications and before Track Order */}
          <View style={{ height: 1, backgroundColor: '#d3d3d3', marginVertical: 10 }} />
          <DrawerItem
            icon={() => (
              <Image source={TrackOrderIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Track Order"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate('TrackOrder')}
          />
          <DrawerItem
            icon={() => (
              <Image source={ReferIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Refer & Earn"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate('Refer & Earn')}
            style={{ marginBottom: 10 }}
          />
          {/* Spacing after Refer & Earn and before Contact */}
          <View style={{ height: 1, backgroundColor: '#d3d3d3', marginVertical: 10 }} />
          <DrawerItem
            icon={() => (
              <Image source={ContactIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Contact"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate('Contact')}
          />
          <DrawerItem
            icon={() => (
              <Image source={AboutIcon} style={{ width: 24, height: 24 }} />
            )}
            label="About Us"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate('About')}
          />
          <DrawerItem
            icon={() => (
              <Image source={RateIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Rate Us"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate('Rate Us')}
          />
          <DrawerItem
            icon={() => (
              <Image source={ShareIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Share App"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate('ShareApp')}
            style={{ marginBottom: 10 }}
          />
          {/* Spacing after Share App and before FAQ */}
          <View style={{ height: 1, backgroundColor: '#d3d3d3', marginVertical: 10 }} />
          <DrawerItem
            icon={() => (
              <Image source={FAQIcon} style={{ width: 24, height: 24 }} />
            )}
            label="FAQ"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate('FAQ')}
          />
          <DrawerItem
            icon={() => (
              <Image source={TermsIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Terms & Conditions"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate('TermsAndConditions')}
          />
          <DrawerItem
            icon={() => (
              <Image source={PrivacyIcon} style={{ width: 24, height: 24 }} />
            )}
            label="Privacy Policy"
            labelStyle={styles.textCommon}
            onPress={() => props.navigation.navigate('PrivacyPolicy')}
          />
          {/* Spacing after Privacy Policy and before Logout/Logo section */}
          <View style={{ height: 1, backgroundColor: '#d3d3d3', marginVertical: 10 }} />
          <DrawerItem
            icon={() => <Ionicons name="log-out-outline" size={24} color="#000" />}
            label="Logout"
            labelStyle={styles.textCommon}
            onPress={async () => {
              await AsyncStorage.removeItem('userData');
              props.navigation.replace('Login');
            }}
          />
          <DrawerItem
            icon={() => <MaterialIcons name="delete-outline" size={24} color="red" />}
            label="Delete Account"
            labelStyle={[styles.textCommon, { color: 'red' }]}
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Yes',
                    onPress: () => console.log('Delete account API call here'),
                  },
                ],
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
    backgroundColor: '#FF0000',
    alignItems: 'center',
    paddingVertical: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  textCommon: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    textTransform: 'capitalize',
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
  phoneText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins',
    marginTop: 4,
  },
});

export default SlideBar;