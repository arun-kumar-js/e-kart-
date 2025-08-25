import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../config/globalStyles';

const FontTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Poppins Font Test</Text>
      <Text style={styles.regular}>Regular Text - Poppins Regular</Text>
      <Text style={styles.medium}>Medium Text - Poppins Medium</Text>
      <Text style={styles.semibold}>SemiBold Text - Poppins SemiBold</Text>
      <Text style={styles.bold}>Bold Text - Poppins Bold</Text>
      <Text style={styles.light}>Light Text - Poppins Light</Text>
      <Text style={styles.thin}>Thin Text - Poppins Thin</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.BOLD,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  regular: {
    fontSize: 18,
    fontFamily: FONTS.REGULAR,
    color: '#666',
    marginBottom: 15,
  },
  medium: {
    fontSize: 18,
    fontFamily: FONTS.MEDIUM,
    color: '#666',
    marginBottom: 15,
  },
  semibold: {
    fontSize: 18,
    fontFamily: FONTS.SEMI_BOLD,
    color: '#666',
    marginBottom: 15,
  },
  bold: {
    fontSize: 18,
    fontFamily: FONTS.BOLD,
    color: '#666',
    marginBottom: 15,
  },
  light: {
    fontSize: 18,
    fontFamily: FONTS.LIGHT,
    color: '#666',
    marginBottom: 15,
  },
  thin: {
    fontSize: 18,
    fontFamily: FONTS.THIN,
    color: '#666',
    marginBottom: 15,
  },
});

export default FontTest;
