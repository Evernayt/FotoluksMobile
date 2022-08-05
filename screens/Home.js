import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  CategoryItem,
  Header,
  Loader,
  SendToPrintModal,
} from '../components';
import { COLORS, FONTS, SIZES } from '../constants';
import { useModal } from '../hooks';
import { fetchCategoriesAPI } from '../http/productAPI';
import Toast from '@skilopay/react-native-easy-toast';
import { checkAPI } from '../http/userAPI';
import { loginAction } from '../store/userReducer';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isAuth = useSelector(state => state.user.isAuth);

  const toastWarningRef = useRef();

  const { isShowing, toggle } = useModal();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    checkAPI()
      .then(data => {
        if (data) {
          dispatch(loginAction(data));
        }
      })
      .catch(() => {});
    setLoading(true);
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetchCategoriesAPI()
      .then(data => {
        setCategories(data);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const refresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const openModal = () => {
    if (isAuth) {
      toggle();
    } else {
      toastWarningRef.current.show('Пожалуйста, войдите в аккаунт', 2000);
    }
  };

  const renderCategoriesItem = ({ item }) => {
    return (
      <View style={styles.categoryContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Subcategories', { category: item })
            }>
            <Text style={styles.link}>Посмотреть все</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={item.products}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => `${item.id}`}
          renderItem={renderSubcategoriesItem}
          contentContainerStyle={{
            paddingLeft: 24,
            paddingRight: 10,
          }}
        />
      </View>
    );
  };

  const renderSubcategoriesItem = ({ item }) => {
    return (
      <CategoryItem width={156} height={183} product={item} marginRight={16} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <>
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={categories}
            keyExtractor={item => `${item.id}`}
            renderItem={renderCategoriesItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
          />
        )}
      </>
      <Toast
        ref={toastWarningRef}
        style={{ backgroundColor: COLORS.warning }}
        textStyle={{ color: COLORS.primaryText }}
      />
      <SendToPrintModal isShowing={isShowing} hide={toggle} />
      <View style={styles.footer}>
        <Button text="Отправить на печать" onPress={openModal} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    paddingBottom: 82,
  },
  categoryContainer: {
    marginTop: 16,
    marginBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 35,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: FONTS.medium,
    color: COLORS.primaryText,
    fontSize: 22,
  },
  link: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.primaryDeemphasizedText,
    marginBottom: 2,
  },
  footer: {
    padding: 16,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    backgroundColor: COLORS.background,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  panelContainer: {
    height: '100%',
  },
  panel: {
    height: '70%',
    backgroundColor: 'red',
  },
});

export default Home;
