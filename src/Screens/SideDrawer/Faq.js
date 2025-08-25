import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { FAQ, API_ACCESS_KEY, API_BASE_URL } from '../../config/config';
import RenderHTML from 'react-native-render-html';

const Faq = () => {
  console.log('Faq component mounted');
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { width } = useWindowDimensions();

  const fetchFaq = async () => {
    console.log('Starting FAQ API fetch...');
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.get(FAQ);
      console.log('API response raw:', response);

      if (response.status === 200 && response.data) {
        let htmlContent = response.data;
        htmlContent = htmlContent.replace(/<img[^>]*>/g, ''); // remove all images
        setApiResponse(htmlContent);
      } else {
        console.log('API returned empty content or error', response);
        setErrorMessage('API returned empty content or error');
      }
    } catch (error) {
      console.log('API fetch error:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
      console.log('API fetch finished');
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('FAQ page focused, triggering API fetch...');
      fetchFaq();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#EE2737" />
      ) : errorMessage ? (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.card}>
            <Text style={styles.heading}>FAQ</Text>
            <RenderHTML source={{ html: apiResponse }} contentWidth={width} />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: '#EE2737',
    marginBottom: 15,
  },
  errorText: { fontSize: 16, color: 'red', fontFamily: 'Poppins' },
});

export default Faq;
