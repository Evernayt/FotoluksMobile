import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Button,
  KeyboardAvoidingWrapper,
  MaskedInput,
  NavigationHeader,
} from '../components';
import { COLORS, FONTS, IMAGES } from '../constants';
import { isVerifiedAPI } from '../http/verificationAPI';
import { unMask } from 'react-native-mask-text';

const RegistrationOne = () => {
  const [phone, setPhone] = useState('');

  const navigation = useNavigation();

  const next = () => {
    if (phone !== '') {
      const unmaskedPhone = unMask(phone);

      isVerifiedAPI(unmaskedPhone)
        .then(data => {
          if (data.user && data.phoneVerified) {
            alert('Пользователь с таким номером телефона уже зарегестрирован.');
          } else {
            navigation.navigate('RegistrationTwo', {
              maskedPhone: phone,
              unmaskedPhone,
              phoneVerified: data.phoneVerified,
              user: data.user,
            });
          }
        })
        .catch(e => {
          alert(e.response.data.message);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader title="Регистрация" />
      <KeyboardAvoidingWrapper>
        <View style={{ marginHorizontal: 24 }}>
          <View style={styles.logoContainer}>
            <Image
              source={IMAGES.logo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
          <Text style={styles.titleText}>Введите номер телефона</Text>
          <MaskedInput
            placeholder="Номер телефона"
            onChangeText={setPhone}
            value={phone}
            keyboardType="phone-pad"
            returnKeyType="done"
            onSubmitEditing={next}
            maxLength={17}
          />

          <Button
            text="Продолжить"
            onPress={next}
            disabled={phone.length < 17}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText1}>
              {'Уже есть аккаунт? '}
              <Text style={styles.loginLinkText2}>Авторизоваться</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  logo: {
    width: 100,
    height: 100,
  },
  titleText: {
    fontFamily: FONTS.medium,
    fontSize: 18,
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 28,
  },
  loginLinkText1: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.secondaryText,
  },
  loginLinkText2: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.primaryDeemphasizedText,
  },
});

export default RegistrationOne;
