import { Platform, StyleSheet } from 'react-native';

export const FONTS = {
  REGULAR: Platform.OS === 'ios' ? 'Montserrat-Regular' : 'Montserrat-Regular',
  MEDIUM: Platform.OS === 'ios' ? 'Montserrat-Medium' : 'Montserrat-Medium',
  SEMIBOLD:
    Platform.OS === 'ios' ? 'Montserrat-SemiBold' : 'Montserrat-SemiBold',
  BOLD: Platform.OS === 'ios' ? 'Montserrat-Bold' : 'Montserrat-Bold',
  LIGHT: Platform.OS === 'ios' ? 'Montserrat-Light' : 'Montserrat-Light',
  EXTRALIGHT:
    Platform.OS === 'ios' ? 'Montserrat-ExtraLight' : 'Montserrat-ExtraLight',
  THIN: Platform.OS === 'ios' ? 'Montserrat-Thin' : 'Montserrat-Thin',
  BLACK: Platform.OS === 'ios' ? 'Montserrat-Black' : 'Montserrat-Black',
};

export const globalTextStyles = StyleSheet.create({
  h1: { fontFamily: FONTS.BOLD, fontSize: 24, fontWeight: 'bold' },
  h2: { fontFamily: FONTS.SEMIBOLD, fontSize: 20, fontWeight: '600' },
  h3: { fontFamily: FONTS.MEDIUM, fontSize: 18, fontWeight: '500' },
  h4: { fontFamily: FONTS.MEDIUM, fontSize: 16, fontWeight: '500' },
  h5: { fontFamily: FONTS.REGULAR, fontSize: 14, fontWeight: '400' },
  h6: { fontFamily: FONTS.REGULAR, fontSize: 12, fontWeight: '400' },
  body: { fontFamily: FONTS.REGULAR, fontSize: 16, fontWeight: '400' },
  bodySmall: { fontFamily: FONTS.REGULAR, fontSize: 14, fontWeight: '400' },
  bodyLarge: { fontFamily: FONTS.REGULAR, fontSize: 18, fontWeight: '400' },
  caption: { fontFamily: FONTS.LIGHT, fontSize: 12, fontWeight: '300' },
  button: { fontFamily: FONTS.MEDIUM, fontSize: 16, fontWeight: '500' },
  buttonSmall: { fontFamily: FONTS.MEDIUM, fontSize: 14, fontWeight: '500' },
  buttonLarge: { fontFamily: FONTS.MEDIUM, fontSize: 18, fontWeight: '500' },
});

export const getFontFamily = (weight = 'regular') => {
  const fontMap = {
    thin: FONTS.THIN,
    extralight: FONTS.EXTRALIGHT,
    light: FONTS.LIGHT,
    regular: FONTS.REGULAR,
    medium: FONTS.MEDIUM,
    semibold: FONTS.SEMIBOLD,
    bold: FONTS.BOLD,
    black: FONTS.BLACK,
  };
  return fontMap[weight.toLowerCase()] || FONTS.REGULAR;
};

export const defaultTextStyle = {
  fontFamily: FONTS.REGULAR,
  fontSize: 16,
  fontWeight: '400',
};

export const commonTextStyles = {
  h1: { fontFamily: FONTS.BOLD, fontSize: 24, fontWeight: 'bold' },
  h2: { fontFamily: FONTS.SEMIBOLD, fontSize: 20, fontWeight: '600' },
  h3: { fontFamily: FONTS.MEDIUM, fontSize: 18, fontWeight: '500' },
  h4: { fontFamily: FONTS.MEDIUM, fontSize: 16, fontWeight: '500' },
  h5: { fontFamily: FONTS.REGULAR, fontSize: 14, fontWeight: '400' },
  h6: { fontFamily: FONTS.REGULAR, fontSize: 12, fontWeight: '400' },
  body: { fontFamily: FONTS.REGULAR, fontSize: 16, fontWeight: '400' },
  bodySmall: { fontFamily: FONTS.REGULAR, fontSize: 14, fontWeight: '400' },
  bodyLarge: { fontFamily: FONTS.REGULAR, fontSize: 18, fontWeight: '400' },
  caption: { fontFamily: FONTS.LIGHT, fontSize: 12, fontWeight: '300' },
  button: { fontFamily: FONTS.MEDIUM, fontSize: 16, fontWeight: '500' },
  buttonSmall: { fontFamily: FONTS.MEDIUM, fontSize: 14, fontWeight: '500' },
  buttonLarge: { fontFamily: FONTS.MEDIUM, fontSize: 18, fontWeight: '500' },
};

export default globalTextStyles;
