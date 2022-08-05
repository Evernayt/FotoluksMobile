import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { CategoryItem, NavigationHeader } from '../components';
import { COLORS, SIZES } from '../constants';

const Subcategories = ({ route }) => {
  const { category } = route.params;

  const navigation = useNavigation();

  const width = (SIZES.width - 48) / 2;
  const height = width * 1.17;

  const renderSubcategoriesItem = ({ item }) => {
    return <CategoryItem width={width - 8} height={height} product={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader title={category.name} navigation={navigation} />
      <FlatList
        data={category.products}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
        keyExtractor={item => `${item.id}`}
        renderItem={renderSubcategoriesItem}
        contentContainerStyle={{ padding: 24 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default Subcategories;
