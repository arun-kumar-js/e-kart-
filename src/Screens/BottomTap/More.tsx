import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type ListItemProps = {
  icon: string;
  label: string;
  onPress: () => void;
};

const ListItem: React.FC<ListItemProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <Icon name={icon} size={24} color="#666" style={styles.listItemIcon} />
    <Text style={styles.listItemText}>{label}</Text>
  </TouchableOpacity>
);

type TabItemProps = {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
};

const TabItem: React.FC<TabItemProps> = ({ icon, label, active, onPress }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <Icon name={icon} size={24} color={active ? '#EE2737' : '#888'} />
    <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const More = () => {
  const menuItems = [
    { icon: 'shopping-bag', label: 'My Orders' },
    { icon: 'bell', label: 'Notifications' },
    { icon: 'phone', label: 'Contact Us' },
    { icon: 'info-circle', label: 'About Us' },
    { icon: 'star-o', label: 'Rate Us' },
    { icon: 'share-alt', label: 'Share App' },
    { icon: 'users', label: 'Refer & Earn' },
    { icon: 'question-circle-o', label: 'FAQ' },
    { icon: 'file-text-o', label: 'Terms & Conditions' },
    { icon: 'shield', label: 'Privacy Policy' },
    { icon: 'sign-out', label: 'Log Out' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#EE2737" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>VM</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Veeramani</Text>
                <Text style={styles.profilePhone}>9176123456</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.walletBalanceContainer}>
            <Text style={styles.walletBalanceText}>Wallet Balance</Text>
            <Text style={styles.walletBalanceAmount}>₹ 0.00</Text>
          </View>

          <View style={styles.listContainer}>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                icon={item.icon}
                label={item.label}
                onPress={() => {}}
              />
            ))}
          </View>
        </ScrollView>
       
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EE2737',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 80, // Space for the bottom nav
  },
  header: {
    backgroundColor: '#EE2737',
    paddingHorizontal: 20,
    paddingVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#EE2737',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {},
  profileName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profilePhone: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 2,
  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  editProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  walletBalanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  walletBalanceText: {
    fontSize: 17,
    color: '#EE2737',
  },
  walletBalanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EE2737',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemIcon: {
    width: 30,
    textAlign: 'center',
  },
  listItemText: {
    fontSize: 17,
    color: '#333',
    marginLeft: 20,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
    paddingBottom: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#EE2737',
  },
});

export default More;
