import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const [mobileNumber, setMobileNumber] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#EE2737" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity>
              <Icon name="arrow-left" size={24} color="#555555" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Login</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContentContainer}>
            <View style={styles.logoContainer}>
              <Icon name="users" size={50} color="#FFFFFF" />
              <Text style={styles.logoText}>Customer</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your mobile number"
                  placeholderTextColor="#A9A9A9"
                  keyboardType="phone-pad"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  maxLength={10}
                />
              </View>

              <Text style={styles.otpInfoText}>
                You will receive a 6 digit OTP through SMS
              </Text>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>GET OTP</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By logging in you agree to our Terms & Conditions
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 25 : 15,
    paddingBottom: 15,
  },
  headerTitle: {
    color: '#EE2737',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    backgroundColor: '#EE2737',
    width: 125,
    height: 125,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 70,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    width: '100%',
    paddingBottom: 8,
  },
  countryCode: {
    fontSize: 18,
    color: '#333333',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333333',
    paddingVertical: 0,
  },
  otpInfoText: {
    color: '#8A8A8A',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#EE2737',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#8A8A8A',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default App;
