import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  ADD_NEW_ADDRESS_STATE,
  ADD_NEW_ADDRESS_CITY,
  ADD_NEW_ADDRESS_AREA,
  API_ACCESS_KEY,
} from '../config/config';

const HEADER_COLOR = '#F40612';
const BACKGROUND_COLOR = '#FFFFFF';
const BORDER_COLOR = '#C5C5C5';
const TEXT_COLOR_DARK = '#333333';
const TEXT_COLOR_MEDIUM = '#555555';
const BORDER_BOTTOM_COLOR = '#EAEAEA';

const DropdownSelector = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.dropdownContainer} onPress={onPress}>
    <Text style={styles.dropdownText}>{label}</Text>
    <Icon name="caret-down" size={24} color={TEXT_COLOR_MEDIUM} />
  </TouchableOpacity>
);

type ItemType = { id: string; name: string };

const AddAddress = () => {
  const [states, setStates] = useState<ItemType[]>([]);
  const [cities, setCities] = useState<ItemType[]>([]);

  const [selectedState, setSelectedState] = useState<ItemType | null>(null);
  const [selectedCity, setSelectedCity] = useState<ItemType | null>(null);

  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  useEffect(() => {
    // Fetch all states on mount
    const formData = new FormData();
    formData.append('accesskey', API_ACCESS_KEY);

    axios
      .post(ADD_NEW_ADDRESS_STATE, formData)
      .then(res => {
        console.log('Fetched states:', res.data); // Added console.log for debugging
        setStates(res.data.data || []); // Adjusted to use res.data.data
      })
      .catch(err => console.error('Error fetching states:', err));
  }, []);

  const handleStateSelect = (state: ItemType) => {
    setSelectedState(state);
    setSelectedCity(null);
    setCities([]);
    setStateModalVisible(false);

    // Fetch cities for selected state
    const formData = new FormData();
    formData.append('accesskey', API_ACCESS_KEY);
    formData.append('state_id', state.id);

    axios
      .post(ADD_NEW_ADDRESS_CITY, formData)
      .then(res => {
        console.log('Fetched cities:', res.data); // Added console.log for debugging
        setCities(res.data.data || []);
      })
      .catch(err => console.error('Error fetching cities:', err));
  };

  const handleCitySelect = (city: ItemType) => {
    setSelectedCity(city);
    setCityModalVisible(false);
  };

  const renderModalItem = (item: ItemType, onSelect: (item: ItemType) => void) => (
    <TouchableOpacity
      style={{
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('4%'),
        borderBottomWidth: 1,
        borderBottomColor: BORDER_BOTTOM_COLOR,
      }}
      onPress={() => onSelect(item)}
    >
      <Text style={{ fontSize: wp('4.5%'), color: TEXT_COLOR_DARK }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_COLOR} />
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={20} color={BACKGROUND_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add address</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Name, Phone, Email Inputs */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Name"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Phone number"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
              keyboardType="email-address"
            />
          </View>

          {/* Address */}
          <View style={[styles.inputContainer, styles.addressInputContainer]}>
            <TextInput
              placeholder="Address"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={[styles.input, styles.addressInput]}
              multiline
            />
          </View>

          {/* Dropdowns */}
          <DropdownSelector
            label={selectedState ? selectedState.name : 'Select State'}
            onPress={() => setStateModalVisible(true)}
          />
          <DropdownSelector
            label={selectedCity ? selectedCity.name : 'Select City'}
            onPress={() => {
              if (cities.length > 0) {
                setCityModalVisible(true);
              }
            }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Pin Code"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
              keyboardType="number-pad"
            />
          </View>



          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Landmark (Optional)"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
            />
          </View>

          <Text style={styles.locationLabel}>
            Location : {selectedState ? selectedState.name : 'Select State'}, India
          </Text>

          <Image
            source={{ uri: 'https://placehold.co/800x400/f0f0f0/666666' }}
            style={styles.mapImage}
            alt="Map"
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Address & Continue</Text>
        </TouchableOpacity>
      </View>

      {/* State Modal */}
      <Modal
        visible={stateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStateModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setStateModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
            <View
              style={{
                backgroundColor: BACKGROUND_COLOR,
                marginHorizontal: wp('10%'),
                borderRadius: wp('2%'),
                maxHeight: hp('50%'),
              }}
            >
              <FlatList
                data={states}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => renderModalItem(item, handleStateSelect)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* City Modal */}
      <Modal
        visible={cityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCityModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
            <View
              style={{
                backgroundColor: BACKGROUND_COLOR,
                marginHorizontal: wp('10%'),
                borderRadius: wp('2%'),
                maxHeight: hp('50%'),
              }}
            >
              <FlatList
                data={cities}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => renderModalItem(item, handleCitySelect)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Keep your previous styles
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  header: {
    backgroundColor: HEADER_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  headerTitle: {
    color: BACKGROUND_COLOR,
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: wp('3.5%'),
    lineHeight: hp('2.8%'),
    marginLeft: wp('5%'),
  },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: hp('2.5%') },
  formContainer: { paddingHorizontal: wp('4%'), paddingTop: hp('3%') },
  inputContainer: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    marginBottom: hp('2.5%'),
    paddingHorizontal: wp('4%'),
  },
  input: { fontSize: wp('4.5%'), color: TEXT_COLOR_DARK, height: hp('6.5%') },
  addressInputContainer: { height: hp('13%'), paddingVertical: hp('1.5%') },
  addressInput: { height: '100%', textAlignVertical: 'top' },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_BOTTOM_COLOR,
    paddingBottom: hp('2.2%'),
    marginBottom: hp('2.5%'),
  },
  dropdownText: { fontSize: wp('4.5%'), color: TEXT_COLOR_DARK },
  locationLabel: {
    fontSize: wp('4%'),
    color: TEXT_COLOR_MEDIUM,
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
  },
  mapImage: {
    width: '100%',
    height: hp('22%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  footer: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
    backgroundColor: BACKGROUND_COLOR,
  },
  saveButton: {
    backgroundColor: HEADER_COLOR,
    borderRadius: wp('2%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: BACKGROUND_COLOR,
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
});

export default AddAddress;
