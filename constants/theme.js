import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#ffd60a',
  primaryDeemphasized: '#ffea83',
  secondary: '#ebeae4',
  primaryText: '#050505',
  primaryDeemphasizedText: '#FFC300',
  secondaryText: '#9C9C9C',
  background: '#ffffff',
  border: '#e2e1dd',
  disabledBackground: '#ebeae4',
  disabledText: '#c4c3bc',
  success: '#42B72A',
  error: '#EB5C5C',
  warning: '#ffc107',
};

export const SIZES = {
  width,
  height,
  radius: 10,
  header: 74,
};

export const FONTS = {
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
