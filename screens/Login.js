import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  Button,
  Input,
  KeyboardAvoidingWrapper,
  MaskedInput,
  NavigationHeader,
} from '../components';
import { COLORS, FONTS, IMAGES } from '../constants';
import { loginAPI } from '../http/userAPI';
import { loginAction } from '../store/userReducer';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const refPasswordInput = useRef();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const signIn = () => {
    const unmaskedLogin = login.replace(/[^\d;]/g, '');
    loginAPI(unmaskedLogin, password)
      .then(data => {
        dispatch(loginAction(data));
        navigation.navigate('Home');
      })
      .catch(e => {
        alert(e.response.data.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader title="Авторизация" />
      <KeyboardAvoidingWrapper>
        <View style={{ marginHorizontal: 24 }}>
          <View style={styles.logoContainer}>
            <Image
              source={IMAGES.logo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>

          <View>
            <MaskedInput
              placeholder="Телефон"
              onChangeText={setLogin}
              value={login}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => refPasswordInput.current.focus()}
              blurOnSubmit={false}
              maxLength={17}
            />

            <View>
              <Input
                placeholder="Пароль"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                returnKeyType="done"
                onSubmitEditing={signIn}
                ref={refPasswordInput}
                style={{ paddingRight: 100 }}
              />
              <TouchableOpacity
                style={styles.inputLink}
                onPress={() =>
                  navigation.navigate('PasswordRecoveryOne', {
                    maskedPhone: login,
                  })
                }>
                <Text style={styles.inputLinkText}>Забыли?</Text>
              </TouchableOpacity>
            </View>

            <Button
              text="Войти"
              onPress={signIn}
              disabled={login.length < 17 || !password}
            />

            <TouchableOpacity
              style={styles.registrationLink}
              onPress={() => navigation.navigate('RegistrationOne')}>
              <Text style={styles.registrationLinkText1}>
                {'У вас нет аккаунта? '}
                <Text style={styles.registrationLinkText2}>
                  Зарегистрироваться
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
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
  inputLink: {
    position: 'absolute',
    right: 18,
    top: 14,
  },
  inputLinkText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.primaryDeemphasizedText,
  },
  registrationLink: {
    alignItems: 'center',
    marginTop: 28,
  },
  registrationLinkText1: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.secondaryText,
  },
  registrationLinkText2: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.primaryDeemphasizedText,
  },
});

export default Login;
