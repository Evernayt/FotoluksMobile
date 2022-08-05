import React, { forwardRef, useState } from 'react';
import { TextInput } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';

const Input = forwardRef((props, ref) => {
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderColor, setBorderColor] = useState(COLORS.border);

  const onFocus = () => {
    setBorderWidth(2);
    setBorderColor(COLORS.primary);
  };

  const onBlur = () => {
    setBorderWidth(1);
    setBorderColor(COLORS.border);
  };

  return (
    <TextInput
      ref={ref}
      placeholderTextColor={COLORS.secondaryText}
      {...props}
      style={[
        {
          height: 50,
          borderWidth: borderWidth,
          borderColor: borderColor,
          borderRadius: SIZES.radius,
          fontFamily: FONTS.regular,
          fontSize: 16,
          color: COLORS.primaryText,
          paddingLeft: 18,
          paddingRight: 18,
          marginBottom: 12,
        },
        { ...props.style },
      ]}
      onFocus={() => onFocus()}
      onBlur={() => onBlur()}
    />
  );
});

export default Input;
