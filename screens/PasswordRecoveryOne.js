import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Button,
  KeyboardAvoidingWrapper,
  MaskedInput,
  NavigationHeader,
} from '../components';
import { COLORS, FONTS, IMAGES } from '../constants';
import { unMask } from 'react-native-mask-text';

const PasswordRecoveryOne = () => {
  const [phone, setPhone] = useState('');

  const navigation = useNavigation();

  const next = () => {
    if (phone !== '') {
      const unmaskedPhone = unMask(phone);
      navigation.navigate('PasswordRecoveryTwo', {
        maskedPhone: phone,
        unmaskedPhone,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader title="Восстановление" />
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
          <Text style={styles.text}>
            Код для смены пароля будет выслан по SMS
          </Text>
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
    marginBottom: 8,
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default PasswordRecoveryOne;
