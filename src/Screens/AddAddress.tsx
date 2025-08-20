import React from 'react';
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
} from 'react-native';
// In a real app, you would install and link this library:
// npm install react-native-vector-icons
// For this example, we assume it's available.
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const HEADER_COLOR = '#F40612';
const BACKGROUND_COLOR = '#FFFFFF';
const BORDER_COLOR = '#C5C5C5';
const TEXT_COLOR_DARK = '#333333';
const TEXT_COLOR_MEDIUM = '#555555';
const BORDER_BOTTOM_COLOR = '#EAEAEA';

const DropdownSelector = ({ label }: { label: string }) => (
  <TouchableOpacity style={styles.dropdownContainer}>
    <Text style={styles.dropdownText}>{label}</Text>
    <Icon name="caret-down" size={24} color={TEXT_COLOR_MEDIUM} />
  </TouchableOpacity>
);

const AddAddress = () => {
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

          <View style={[styles.inputContainer, styles.addressInputContainer]}>
            <TextInput
              placeholder="Address"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={[styles.input, styles.addressInput]}
              multiline={true}
            />
          </View>

          <DropdownSelector label="Andaman & Nicobar islands" />
          <DropdownSelector label="Select City" />
          <DropdownSelector label="Select Area" />

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
              placeholder="GST Number (Optional)"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
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
            Location : Andaman and Nicobar Islands, India
          </Text>

          <Image
            source={{ uri: 'https://placehold.co/800x400/f0f0f0/666666' }}
            style={styles.mapImage}
            alt="A map of a city area showing streets and buildings. Several locations are marked, including Newark Timber Supplies, Costa Coffee, Just Vehicle Solutions, Sportsdirect Fitness Newark, and Newark Northgate Rail Station. A red pin marks a specific location on the map."
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Address & Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
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
    letterSpacing: 0,
    textAlign: 'center',
    marginLeft: wp('5%'),
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: hp('2.5%'),
  },
  formContainer: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('3%'),
  },
  inputContainer: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    marginBottom: hp('2.5%'),
    paddingHorizontal: wp('4%'),
  },
  input: {
    fontSize: wp('4.5%'),
    color: TEXT_COLOR_DARK,
    height: hp('6.5%'),
  },
  addressInputContainer: {
    height: hp('13%'),
    paddingVertical: hp('1.5%'),
  },
  addressInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_BOTTOM_COLOR,
    paddingBottom: hp('2.2%'),
    marginBottom: hp('2.5%'),
  },
  dropdownText: {
    fontSize: wp('4.5%'),
    color: TEXT_COLOR_DARK,
  },
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
