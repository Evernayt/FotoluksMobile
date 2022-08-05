import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.header,
  },
});

export default Loader;
