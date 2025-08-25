import { StyleSheet, Text, View, Share } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const ShareApp = () => {
  const navigation = useNavigation();

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this awesome app: https://example.com/app',
        url: 'https://example.com/image.jpg',
      })
      if (result.action === Share.dismissedAction || result.action !== Share.sharedAction) {
        navigation.goBack();
      }
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    onShare();
  }, []);

  return (
    <View>
    </View>
  )
}

export default ShareApp
const styles = StyleSheet.create({})