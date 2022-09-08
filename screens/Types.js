import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Loader, NavigationHeader } from '../components';
import { COLORS, FONTS, IMAGES, SIZES } from '../constants';
import { fetchTypesAPI } from '../http/productAPI';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { groupBy } from '../helpers';

const itemWidth = SIZES.width - 96;

const Types = ({ route }) => {
  const { product } = route.params;

  const [types, setTypes] = useState([]);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
  const [typeFeatures, setTypeFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTypesAPI(product.id)
      .then(data => {
        setTypes(data);
        const typeFeatures = [];
        for (let i = 0; i < data.length; i++) {
          typeFeatures.push({
            typeId: data[i].id,
            features: groupBy(data[i].params, 'featureId'),
          });
        }
        setTypeFeatures(typeFeatures);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Image
        source={item.image ? { uri: item.image } : IMAGES.noImage}
        style={styles.image}
        resizeMode="cover"
      />
    );
  };

  const renderColorsItem = ({ item }) => {
    return (
      <View
        style={{
          height: 46,
          width: 46,
          borderRadius: 24,
          borderWidth: 2,
          borderColor: COLORS.border,
          backgroundColor: item.value,
          marginRight: 10,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader title={product.name} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <View style={styles.carousel}>
            <Carousel
              data={types}
              renderItem={renderItem}
              sliderWidth={SIZES.width}
              itemWidth={itemWidth}
              onSnapToItem={setSelectedTypeIndex}
            />
          </View>
          {types.length > 0 && (
            <View style={styles.footer}>
              <Text style={styles.typeName}>
                {types[selectedTypeIndex].name}
              </Text>
              {typeFeatures[selectedTypeIndex].features?.map(params => {
                if (params[0].feature.name === 'Цвет') {
                  return (
                    <FlatList
                      data={params}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={item => `${item.id}`}
                      renderItem={renderColorsItem}
                      contentContainerStyle={{
                        paddingLeft: 24,
                        paddingRight: 14,
                        marginTop: 24,
                      }}
                      key={params[0].id}
                    />
                  );
                } else {
                  return null;
                }
              })}
              <Text style={styles.price}>
                {types[selectedTypeIndex].price} руб.
              </Text>
              <Pagination
                activeDotIndex={selectedTypeIndex}
                dotsLength={types.length}
                dotStyle={styles.dot}
                inactiveDotStyle={styles.inactiveDot}
                inactiveDotOpacity={1}
                inactiveDotScale={1}
                containerStyle={{ paddingVertical: 24 }}
              />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: itemWidth,
    height: '100%',
    borderRadius: SIZES.radius,
  },
  carousel: {
    flex: 2,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 24,
  },
  typeName: {
    textAlign: 'center',
    fontFamily: FONTS.medium,
    fontSize: 18,
    marginBottom: 'auto',
    color: COLORS.primaryText,
  },
  price: {
    textAlign: 'center',
    fontFamily: FONTS.medium,
    fontSize: 24,
    color: COLORS.primaryDeemphasizedText,
  },
  dot: {
    width: 20,
    height: 4,
    borderRadius: 2,
    marginHorizontal: -4,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 10,
    backgroundColor: COLORS.secondary,
  },
});

export default Types;
