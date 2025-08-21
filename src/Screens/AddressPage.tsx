import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_ACCESS_KEY } from '../config/config';
import axios from 'axios';
import { s } from 'react-native-size-matters';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

const ChooseAddressScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  console.log('User data from AsyncStorage:', user);
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          setUser(userObj);

          const formData = new FormData();
          formData.append('user_id', userObj.user_id); // use userObj directly
          formData.append('accesskey', API_ACCESS_KEY);
          formData.append('type', 'list_address');

          try {
            const response = await axios.post(
              'https://spiderekart.in/ec_service/api-firebase/user_addresses.php',
              formData,
              { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log('Fetched addresses:', response.data.data);
            setAddresses(response.data.data || []);
          } catch (axiosError: any) {
            if (axiosError.response) {
              console.error('Server error:', axiosError.response.data);
            } else if (axiosError.request) {
              console.error('No response received:', axiosError.request);
            } else {
              console.error('Axios error:', axiosError.message);
            }
          }
        } else {
          console.warn('No user data found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <Text style={styles.addressText}>
        {item.street}, {item.city}, {item.state} - {item.zip}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#EF3340" />
      ) : addresses.length === 0 ? (
        <>
          <Image
            source={require('../Assets/Images/No-Address.png')}
            style={styles.image}
          />
          <Text style={styles.title}>No Address Found</Text>
        </>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ width: '100%' }}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (user && user.user_id) {
            navigation.navigate('AddAddress', { user_id: user.user_id });
          }
        }}
      >
        <Text style={styles.buttonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

const Stack = createStackNavigator();

const AddressPage: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#EF3340" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#EF3340',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'normal',
            fontSize: 20,
          },
          headerTitleAlign: 'left',
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="ChooseAddress"
          component={ChooseAddressScreen}
        />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 25,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  button: {
    backgroundColor: '#EF3340',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  addressCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AddressPage;