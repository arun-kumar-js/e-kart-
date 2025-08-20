import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { API_ACCESS_KEY, HOMEPAGE_ENDPOINT } from '../../config/config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type RootStackParamList = {
  CategoryProducts: { categoryId: string | number; categoryName: string };
  SubCategory: {
    category_id: number;
    subcategory_id?: number;
    category_name: string;
  };
};

interface CategoryItem {
  id: number;
  name: string;
  image: string;
}

const Category = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const formData = new FormData();
        formData.append('accesskey', API_ACCESS_KEY);
        const response = await axios.post(HOMEPAGE_ENDPOINT, formData);
        if (response.data && response.data.error === 'false') {
          setCategories(response.data.data.category || []);
        } else {
          console.error('API error:', response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const renderCategory = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate('SubCategory', {
          category_id: item.id,
          category_name: item.name,
        });
      }}
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderBox} />
      )}
      <Text style={styles.cardText} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: wp('2.5%'),
          paddingVertical: hp('2%'),
        }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </SafeAreaView>
  );
};

export default Category;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e60023',
    height: hp('12%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
  },
  locationText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  cardContainer: {
    width: wp('45%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: wp('1%'),
    alignItems: 'center',
    paddingBottom: hp('1.5%'),
    marginBottom: hp('2%'),
    alignSelf: 'flex-start',
  },
  cardImage: {
    width: '100%',
    height: hp('26%'),
    resizeMode: 'cover',
  },
  placeholderBox: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('3%'),
    backgroundColor: '#ccc',
    marginBottom: hp('1.5%'),
  },
  cardText: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: wp('2%'),
    paddingTop: hp('1%'),
  },
});
