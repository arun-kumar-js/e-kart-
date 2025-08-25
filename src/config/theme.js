import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: '#F40612',
    secondary: '#333333',
    background: '#FFFFFF',
    text: '#333333',
    textLight: '#666666',
    border: '#E0E0E0',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  },
  fonts: {
    regular: Platform.OS === 'ios' ? 'Montserrat-Regular' : 'Montserrat-Regular',
    medium: Platform.OS === 'ios' ? 'Montserrat-Medium' : 'Montserrat-Medium',
    semibold: Platform.OS === 'ios' ? 'Montserrat-SemiBold' : 'Montserrat-SemiBold',
    bold: Platform.OS === 'ios' ? 'Montserrat-Bold' : 'Montserrat-Bold',
    light: Platform.OS === 'ios' ? 'Montserrat-Light' : 'Montserrat-Light',
    extralight: Platform.OS === 'ios' ? 'Montserrat-ExtraLight' : 'Montserrat-ExtraLight',
    thin: Platform.OS === 'ios' ? 'Montserrat-Thin' : 'Montserrat-Thin',
    black: Platform.OS === 'ios' ? 'Montserrat-Black' : 'Montserrat-Black',
  },
  textStyles: {
    h1: { fontFamily: 'Montserrat-Bold', fontSize: 24, fontWeight: 'bold' },
    h2: { fontFamily: 'Montserrat-SemiBold', fontSize: 20, fontWeight: '600' },
    h3: { fontFamily: 'Montserrat-Medium', fontSize: 18, fontWeight: '500' },
    h4: { fontFamily: 'Montserrat-Medium', fontSize: 16, fontWeight: '500' },
    h5: { fontFamily: 'Montserrat-Regular', fontSize: 14, fontWeight: '400' },
    h6: { fontFamily: 'Montserrat-Regular', fontSize: 12, fontWeight: '400' },
    body: { fontFamily: 'Montserrat-Regular', fontSize: 16, fontWeight: '400' },
    bodySmall: { fontFamily: 'Montserrat-Regular', fontSize: 14, fontWeight: '400' },
    bodyLarge: { fontFamily: 'Montserrat-Regular', fontSize: 18, fontWeight: '400' },
    caption: { fontFamily: 'Montserrat-Light', fontSize: 12, fontWeight: '300' },
    button: { fontFamily: 'Montserrat-Medium', fontSize: 16, fontWeight: '500' },
    buttonSmall: { fontFamily: 'Montserrat-Medium', fontSize: 14, fontWeight: '500' },
    buttonLarge: { fontFamily: 'Montserrat-Medium', fontSize: 18, fontWeight: '500' },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
};

export const getFontFamily = (weight = 'regular') => {
  const fontMap = {
    thin: theme.fonts.thin,
    extralight: theme.fonts.extralight,
    light: theme.fonts.light,
    regular: theme.fonts.regular,
    medium: theme.fonts.medium,
    semibold: theme.fonts.semibold,
    bold: theme.fonts.bold,
    black: theme.fonts.black,
  };
  return fontMap[weight.toLowerCase()] || theme.fonts.regular;
};

export const defaultTextStyle = {
  fontFamily: theme.fonts.regular,
  fontSize: 16,
  fontWeight: '400',
};

export default theme;
