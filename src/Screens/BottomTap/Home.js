import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { HOMEPAGE_ENDPOINT, API_ACCESS_KEY } from '../../config/config';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
const [data, setData] = useState(null);
const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const promotion = data?.section;

  //console.log('Fetched homepage data:', promotion);
  const fetchHomePageData = async () => {
    try {
      const formData = new FormData();
      formData.append('accesskey', API_ACCESS_KEY);
      const response = await axios.post(HOMEPAGE_ENDPOINT, formData);
      if (response.data && response.data.error === 'false') {
        console.log('Fetched homepage data:', response.data.data);
        return response.data.data;
      } else {
        console.error('API error:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return null;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const res = await fetchHomePageData();
    if (res) {
      setData(res);
      setCategories(res.category || []);
      const prod =
        res.section?.[0]?.products?.map(p => ({
          name: p.name,
          size: p.variants?.[0]?.measurement_unit_name || '',
          price: `₹${p.variants?.[0]?.product_price || ''}`,
          image: { uri: p.image },
        })) || [];
      setProducts(prod);
    }
    setRefreshing(false);
  };

  // Banner auto-slide state
  const bannerRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchHomePageData();
      if (res) {
        setData(res);
        setCategories(res.category || []);
        const prod =
          res.section?.[0]?.products?.map(p => ({
            name: p.name,
            size: p.variants?.[0]?.measurement_unit_name || '',
            price: `₹${p.variants?.[0]?.product_price || ''}`,
            image: { uri: p.image },
          })) || [];
        setProducts(prod);
      }
    };
    loadData();
  }, []);

  // Banner auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!data?.slider || data.slider.length === 0) return;
      const nextIndex = (currentBannerIndex + 1) % data.slider.length;
      bannerRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentBannerIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentBannerIndex, data?.slider]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <>
        {/* Header - fixed */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', gap: wp('3.5%') }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon name="menu" size={wp('6%')} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: wp('2.5%'),
            }}
          >
            <Image
              source={require('../../Assets/Images/Edit.png')}
              style={{
                width: wp('4%'),
                height: hp('2%'),
                tintColor: '#fff',
              }}
            />
            <Text style={styles.locationText}>Choose Location </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Icon name="cart-outline" size={wp('6%')} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Search Bar - fixed */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={wp('5%')}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products.."
              placeholderTextColor="#888"
            />
          </View>
        </View>
      </>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <>
            {/* Banner */}
            <View style={{ overflow: 'hidden', marginTop: 0 }}>
              <FlatList
                data={data?.slider}
                ref={bannerRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                keyExtractor={(item, index) => index.toString()}
                onScroll={e => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x /
                      e.nativeEvent.layoutMeasurement.width,
                  );
                  setCurrentBannerIndex(index);
                }}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.banner}
                    resizeMode="cover"
                  />
                )}
              />
              <View style={styles.dotContainer}>
                {data?.slider?.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      currentBannerIndex === i && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>
            {/* Promotion Section */}
            {data?.section
              ?.filter(
                item => item.title === 'PROMOTION' && item.place === 'top',
              )
              .map((promo, index) => (
                <View
                  key={promo.id}
                  style={{
                    marginHorizontal: wp('4%'),
                    marginVertical: hp('1%'),
                    padding: wp('3%'),
                    backgroundColor:
                      promo.style === 'style_1' ? '#f9fbfcff' : '#f6f7f7ff',
                    borderRadius: wp('2%'),
                  }}
                >
                  <Text
                    style={{
                      fontSize: wp('4%'),
                      fontWeight: '600',
                      marginBottom: hp('0.5%'),
                    }}
                  >
                    {promo.title}
                  </Text>
                
                  <FlatList
                    data={promo.products}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, idx) => idx.toString()}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                          //console.log('Promotion item clicked:', { product: item });
                          navigation.navigate('ProductDetails', { product: item });
                        }}
                        activeOpacity={0.85}
                      >
                        <View
                          style={{
                            width: wp('40%'),
                            marginRight: wp('3%'),
                            backgroundColor: '#edececff',
                            borderRadius: wp('2%'),
                            overflow: 'hidden',
                            elevation: 2,
                          }}
                        >
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              width: '100%',
                              height: hp('20%'),
                              resizeMode: 'cover',
                            }}
                          />
                          <Text style={{ padding: wp('2%'), fontWeight: '500' }}>
                            {item.name}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingHorizontal: wp('2%'),
                              marginBottom: hp('0.5%'),
                            }}
                          >
                            <Text
                              style={{
                                color: '#888',
                                fontSize: wp('3%'),
                                flex: 1,
                              }}
                            >
                              1 Pc
                            </Text>
                            <Text
                              style={{
                                color: 'green',
                                fontWeight: 'bold',
                                fontSize: wp('3.5%'),
                                textAlign: 'right',
                              }}
                            >
                              RM{item?.variants?.[0]?.product_price || ''}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#e60023',
                              paddingVertical: hp('0.8%'),
                              margin: wp('2%'),
                              borderRadius: wp('2%'),
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              ))}

            <Text style={styles.sectionTitle}>Category</Text>
            <FlatList
              data={categories}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingHorizontal: wp('2%'),
                paddingBottom: hp('1.5%'),
              }}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: hp('1.5%'),
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => {
                    navigation.navigate('SubCategory', {
                      category_id: item.id,
                      subcategory_id:
                        data?.section?.[0]?.products?.[0]?.subcategory_id,
                      category_name: item.name,
                    });
                  }}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cardImage}
                    />
                  ) : (
                    <View style={styles.placeholderCircle} />
                  )}
                  <Text style={styles.cardText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <Text style={styles.sectionTitle}>New arrival products</Text>
            <FlatList
              data={products}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                paddingHorizontal: wp('2%'),
                paddingBottom: hp('1.5%'),
              }}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: hp('1.5%'),
              }}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <Image source={item.image} style={styles.cardImage} />
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productSize}>{item.size}</Text>
                  <Text style={styles.productPrice}>
                    {item.price.replace('RM', 'RM')}
                  </Text>
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        }
        renderItem={null}
      />
    </SafeAreaView>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e60023',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: wp('3.5%'),
    lineHeight: wp('5.1%'),
    letterSpacing: 0,
  },
  searchContainer: {
    marginTop: 0,
    marginHorizontal: 0,
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: hp('5%'),
    fontSize: wp('3.5%'),
  },
  searchIcon: {
    marginHorizontal: wp('2%'),
  },
  categoryScroll: {
    marginTop: hp('1.5%'),
    paddingHorizontal: wp('2%'),
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: wp('2%'),
  },
  categoryCircle: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    overflow: 'hidden',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderCircle: {
    width: wp('15%'),
    height: wp('15%'),
    backgroundColor: '#ccc',
    borderRadius: wp('7.5%'),
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  banner: {
    width: screenWidth - wp('2.5%'),
    height: hp('25%'),
    borderRadius: wp('3.5%'),
    marginHorizontal: wp('1.2%'),
    overflow: 'hidden',
    paddingTop: hp('1%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    marginHorizontal: wp('4%'),
    marginTop: hp('2.5%'),
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  productCard: {
    width: wp('35%'),
    borderRadius: wp('3%'),
    backgroundColor: '#fff',
    elevation: 2,
    marginRight: wp('3%'),
    padding: wp('2%'),
    alignItems: 'center',
  },
  productImage: {
    width: wp('20%'),
    height: wp('20%'),
    resizeMode: 'contain',
  },
  productName: {
    fontSize: wp('3.3%'),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: hp('1%'),
  },
  productSize: {
    fontSize: wp('3%'),
    color: '#888',
    marginTop: hp('0.5%'),
  },
  productPrice: {
    fontSize: wp('3.5%'),
    color: 'green',
    fontWeight: 'bold',
    marginTop: hp('0.5%'),
  },
  addButton: {
    backgroundColor: '#e60023',
    paddingVertical: hp('0.7%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('1.5%'),
    marginTop: hp('1%'),
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('3.3%'),
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  dot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#ccc',
    marginHorizontal: wp('1%'),
  },
  activeDot: {
    backgroundColor: '#e60023',
  },
  cardContainer: {
    margin: wp('2.5%'),
    width: '45%',
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    overflow: 'hidden',
    marginBottom: hp('1.5%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    alignItems: 'center',
    paddingBottom: hp('1.5%'),
  },
  cardImage: {
    width: '100%',
    height: hp('25%'),
    resizeMode: 'cover',
  },
  cardText: {
    fontSize: wp('3.3%'),
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('1%'),
    color: '#333',
  },
  searchWrapper: {
    backgroundColor: '#e60023',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
  },
});
