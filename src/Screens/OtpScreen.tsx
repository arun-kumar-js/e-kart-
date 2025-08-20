import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Keyboard,
  Platform,
} from 'react-native';

const OTP_LENGTH = 6;

const OtpScreen = () => {
  const [otp, setOtp] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleOtpChange = (text: string) => {
    setOtp(text);
  };

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleResend = () => {
    console.log('Resend OTP');
  };

  const handleVerify = () => {
    console.log('Verify OTP:', otp);
  };

  const renderOtpInputs = () => {
    const inputs = [];
    for (let i = 0; i < OTP_LENGTH; i++) {
      inputs.push(
        <View key={i} style={styles.otpBox}>
          <Text style={styles.otpText}>{otp[i] || ''}</Text>
        </View>,
      );
    }
    return inputs;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#E53935" barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          Please Enter OTP sent via SMS on 91 9629045353
        </Text>

        <TouchableOpacity
          style={styles.otpInputContainer}
          onPress={handlePress}
          activeOpacity={1}
        >
          {renderOtpInputs()}
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={otp}
          onChangeText={handleOtpChange}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          caretHidden={true}
          onBlur={() => Keyboard.dismiss()}
        />

        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendText}>Resend</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>VERIFY</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 36,
    color: '#000000',
    fontWeight: '400',
    marginBottom: 80,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C6C6C',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpText: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '600',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  resendText: {
    fontSize: 16,
    color: '#000000',
    textDecorationLine: 'underline',
    textAlign: 'right',
    marginBottom: 60,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  verifyButton: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default OtpScreen;
