import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import { COLORS } from '../../constants';

const CircleButton = ({ icon, onPress, ...props }) => {
  const shadowOpt = {
    height: 50,
    width: 50,
    color: '#8C8C8C',
    border: 18,
    radius: 25,
    opacity: 0.1,
    x: 0,
    y: 4,
  };

  return (
    <BoxShadow setting={shadowOpt}>
      <TouchableOpacity style={styles.contianer} onPress={onPress}>
        <Image
          source={icon}
          style={styles.icon}
          {...props}
        />
      </TouchableOpacity>
    </BoxShadow>
  );
};

const styles = StyleSheet.create({
  contianer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 25,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default CircleButton;
