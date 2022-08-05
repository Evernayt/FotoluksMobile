import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, ICONS } from '../constants';
import CircleButton from './UI/CircleButton';

const NavigationHeader = ({ title, icon, onPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <CircleButton icon={ICONS.back} onPress={() => navigation.goBack()} />
      <Text style={styles.title}>{title}</Text>
      {icon ? (
        <CircleButton icon={icon} onPress={onPress} />
      ) : (
        <View style={styles.plug} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 96,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 22,
    color: COLORS.primaryText,
  },
  plug: {
    width: 50,
    height: 50,
  },
});

export default NavigationHeader;
