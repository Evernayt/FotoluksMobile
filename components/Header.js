import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, FONTS, ICONS, IMAGES, SIZES } from '../constants';
import CircleButton from './UI/CircleButton';

const Header = () => {
  const isAuth = useSelector(state => state.user.isAuth);
  const user = useSelector(state => state.user.user);

  const navigation = useNavigation();

  return (
    <>
      {isAuth ? (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={user?.avatar ? { uri: user.avatar } : IMAGES.avatar}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.infoText}>Добро пожаловать!</Text>
            <Text style={styles.userNameText}>{user?.name}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <CircleButton
            icon={ICONS.login}
            marginLeft={6}
            onPress={() => navigation.navigate('Login')}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.infoText}>Вы не вошли в аккаунт</Text>
            <Text style={styles.userNameText}>Войти</Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: SIZES.header,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
    marginRight: 12,
  },
  infoText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  userNameText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.primaryText,
  },
});

export default Header;
