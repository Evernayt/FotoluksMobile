import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLORS, FONTS, ICONS, SIZES } from '../constants';
import { fetchShopsAPI } from '../http/shopAPI';
import Button from './UI/Button';

const ShopSelectModal = ({
  isShowing,
  hide,
  selectedShop,
  setSelectedShop,
  continueButtonText,
  continueFunc,
}) => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = () => {
    fetchShopsAPI().then(data => {
      setShops(data.rows);
    });
  };

  const selectShop = shop => {
    setSelectedShop(shop);
  };

  const renderShopItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.shopItem}
        onPress={() => selectShop(item)}>
        <Text style={styles.shopItemText}>{item.name}</Text>
        {selectedShop?.id === item.id && (
          <Image source={ICONS.check} style={styles.shopItemIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal isVisible={isShowing} useNativeDriver={true}>
      <View style={styles.container}>
        <View style={styles.panel}>
          <Text style={styles.title}>Выберите филиал</Text>
          <FlatList
            data={shops}
            keyExtractor={item => `${item.id}`}
            renderItem={renderShopItem}
          />
          <View style={styles.buttonsContainer}>
            <Button
              text={continueButtonText}
              style={{ flex: 1, marginRight: 8 }}
              onPress={continueFunc}
              disabled={!selectedShop}
            />
            <Button
              text="Назад"
              style={{ backgroundColor: COLORS.secondary }}
              onPress={hide}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  panel: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    maxHeight: '50%',
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 18,
    marginVertical: 24,
    color: COLORS.primaryText,
    textAlign: 'center',
  },
  shopItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shopItemText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.primaryText,
  },
  shopItemIcon: {
    tintColor: 'black',
    height: 22,
    width: 22,
  },
  buttonsContainer: {
    margin: 8,
    flexDirection: 'row',
  },
});

export default ShopSelectModal;
