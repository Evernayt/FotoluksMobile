import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import publicIP from 'react-native-public-ip';
import {
  Button,
  Input,
  KeyboardAvoidingWrapper,
  NavigationHeader,
} from '../components';
import { COLORS, FONTS, IMAGES } from '../constants';
import {
  setAttemptIntervalAction,
  setAttemptIntervalTimerIdAction,
  setPhoneAction,
} from '../store/userReducer';
import { checkCodeAPI, createCodeAPI } from '../http/verificationAPI';
import secondsToTime from '../helpers/secondsToTime';
import { useNavigation } from '@react-navigation/native';
import { updatePasswordAPI } from '../http/userAPI';

const PasswordRecoveryTwo = ({ route }) => {
  const { maskedPhone, unmaskedPhone } = route.params;

  const [code, setCode] = useState('');
  const [codeCorrect, setCodeCorrect] = useState(false);
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const attemptInterval = useSelector(state => state.user.attemptInterval);
  const attemptIntervalTimerId = useSelector(
    state => state.user.attemptIntervalTimerId,
  );
  const phone = useSelector(state => state.user.phone);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { minutes, seconds } = secondsToTime(attemptInterval);

  useEffect(() => {
    if (phone !== unmaskedPhone) {
      if (attemptInterval === 0) {
        createCode();
      } else {
        clearInterval(attemptIntervalTimerId);
        createCode();
      }
    }
  }, []);

  const createCode = () => {
    publicIP()
      .then(ip => {
        dispatch(setPhoneAction(unmaskedPhone));
        createCodeAPI(unmaskedPhone, ip)
          .then(data => {
            dispatch(setAttemptIntervalAction(data));
            timerStart(data);
          })
          .catch(e => {
            alert(e.response.data.message);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const timerStart = seconds => {
    const timerId = setInterval(() => {
      if (seconds === 0) {
        clearInterval(timerId);
      } else {
        seconds--;
        dispatch(setAttemptIntervalAction(seconds));
      }
    }, 1000);
    dispatch(setAttemptIntervalTimerIdAction(timerId));
  };

  const checkCode = () => {
    if (code.length === 4) {
      checkCodeAPI(code, unmaskedPhone)
        .then(data => {
          if (data.correct) {
            setCodeCorrect(true);
          }
        })
        .catch(e => {
          alert(e.response.data.message);
        });
    }
  };

  const updatePassword = () => {
    if (password) {
      updatePasswordAPI(phone, password)
        .then(data => {
          if (data.passwordUpdated) {
            navigation.navigate('Login');
            dispatch(setPhoneAction(null));
          }
        })
        .catch(e => {
          alert(e.response.data.message);
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
          {!codeCorrect ? (
            <>
              <Text style={styles.titleText}>Введите код из SMS</Text>
              <TouchableOpacity
                style={styles.link}
                onPress={() => navigation.goBack()}>
                <Text style={styles.linkText1}>
                  {`Мы отправили SMS с кодом\nна номер ${maskedPhone} • `}
                  <Text style={styles.linkText2}>Изменить</Text>
                </Text>
              </TouchableOpacity>
              <Input
                placeholder="Код подтверждения"
                onChangeText={setCode}
                value={code}
                returnKeyType="done"
                keyboardType="numeric"
                onSubmitEditing={checkCode}
                blurOnSubmit={false}
                maxLength={4}
              />

              <Button
                text="Далее"
                onPress={checkCode}
                disabled={code.length < 4}
                style={{ marginBottom: 16 }}
              />
              {attemptInterval === 0 ? (
                <TouchableOpacity style={styles.link} onPress={createCode}>
                  <Text style={styles.linkText2}>Отправить снова</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>
                  {`SMS придет в течении ${minutes}:${seconds}`}
                </Text>
              )}
            </>
          ) : (
            <>
              <View>
                <Input
                  placeholder="Новый пароль"
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry={hidePassword}
                  returnKeyType="done"
                  onSubmitEditing={updatePassword}
                  style={{ paddingRight: 100 }}
                />
                <TouchableOpacity
                  style={styles.inputLink}
                  onPress={() =>
                    setHidePassword(hidePassword => !hidePassword)
                  }>
                  <Text style={styles.inputLinkText}>
                    {hidePassword ? 'Показать' : 'Скрыть'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Button text="Изменить пароль" onPress={updatePassword} />
            </>
          )}
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
  link: {
    alignItems: 'center',
  },
  linkText1: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 24,
  },
  linkText2: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.primaryDeemphasizedText,
  },
  timerText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
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
});

export default PasswordRecoveryTwo;
