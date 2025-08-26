import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import ArrowImage from "../Assets/Images/ArrowRight.png";
import Ionicons from "react-native-vector-icons/Ionicons";
const Header = ({ title, onBack, showBack = true }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        {showBack && <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F70D24",
    width: "100%",
    height: 50,
    paddingTop: 14,
    paddingRight: 16,
    paddingBottom: 14,
    paddingLeft: 16,
    gap: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
 
  backArrow: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Poppins",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 44, // Same width as back button for proper centering
  },
});

export default Header;
