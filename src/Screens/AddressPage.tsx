import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  ChooseAddress: undefined;
};

type ChooseAddressScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChooseAddress'
>;

const AddressPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../Assets/Images/No-Address.png')}
        style={styles.image}
        alt="An illustration of a red map pin with a white question mark inside, set against a light grey circle. A wavy red ribbon flows around the pin. Decorative elements like dashes and dots surround the illustration, conveying a sense of searching or not finding a location."
      />
      <Text style={styles.title}>No Address Found</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
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
        }}
      >
        <Stack.Screen
          name="ChooseAddress"
          component={ChooseAddressScreen}
          options={({ navigation }) => ({
            title: 'Choose address',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Icon name="arrow-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            ),
            headerTitleContainerStyle: {
              left: Platform.OS === 'ios' ? -20 : 50,
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EF3340',
  },
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
});

export default AddressPage;
