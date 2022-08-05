import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';

const Button = ({ text, onPress, style, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[
        {
          height: 50,
          backgroundColor: disabled
            ? COLORS.disabledBackground
            : COLORS.primary,
          borderRadius: SIZES.radius,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
        },
        { ...style },
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text
        style={{
          fontFamily: FONTS.medium,
          fontSize: 16,
          color: disabled ? COLORS.disabledText : COLORS.primaryText,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
