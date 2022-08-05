import React from 'react';
import {
  View,
  TouchableHighlight,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES, SIZES } from '../constants';

const CategoryItem = ({ width, height, product, marginRight = 0 }) => {
  const navigation = useNavigation();

  const openTypes = () => {
    navigation.navigate('Types', { product });
  };

  return (
    <View style={{ marginRight }}>
      <View style={{ marginBottom: 12 }}>
        <TouchableHighlight
          style={{
            width,
            height,
            borderRadius: SIZES.radius,
          }}
          onPress={openTypes}>
          <Image
            source={product.image ? { uri: product.image } : IMAGES.noImage}
            style={styles.itemImage}
            resizeMode='cover'
          />
        </TouchableHighlight>
      </View>

      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.priceStart}>
        От <Text style={styles.price}>{product.minPrice} руб.</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemImage: {
    height: '100%',
    width: '100%',
    borderRadius: SIZES.radius,
  },
  name: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.primaryText,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.secondaryText
  },
  priceStart: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginRight: 4,
    color: COLORS.secondaryText
  },
  price: {
    fontFamily: FONTS.medium,
    fontSize: 18,
    color: COLORS.primaryDeemphasizedText,
  },
});

export default CategoryItem;
