import React, { useEffect, useRef, useState } from 'react';
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
  Input,
  KeyboardAvoidingWrapper,
  NavigationHeader,
} from '../components';
import { COLORS, FONTS, IMAGES } from '../constants';
import { registrationAPI, updateUserAPI } from '../http/userAPI';
import { useDispatch, useSelector } from 'react-redux';
import { createCodeAPI, verifyAPI } from '../http/verificationAPI';
import publicIP from 'react-native-public-ip';
import {
  loginAction,
  setAttemptIntervalAction,
  setAttemptIntervalTimerIdAction,
  setPhoneAction,
} from '../store/userReducer';
import secondsToTime from '../helpers/secondsToTime';

const RegistrationTwo = ({ route }) => {
  const { maskedPhone, unmaskedPhone, phoneVerified, user } = route.params;

  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(phoneVerified);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const attemptInterval = useSelector(state => state.user.attemptInterval);
  const attemptIntervalTimerId = useSelector(
    state => state.user.attemptIntervalTimerId,
  );
  const phone = useSelector(state => state.user.phone);

  const refPasswordInput = useRef();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { minutes, seconds } = secondsToTime(attemptInterval);

  useEffect(() => {
    if (!verified) {
      if (phone !== unmaskedPhone) {
        if (attemptInterval === 0) {
          createCode();
        } else {
          clearInterval(attemptIntervalTimerId);
          createCode();
        }
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

  const verify = () => {
    if (code.length === 4) {
      verifyAPI(code, unmaskedPhone)
        .then(data => {
          if (data.verified) {
            setVerified(true);
          }
        })
        .catch(e => {
          alert(e.response.data.message);
        });
    }
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

  const signUp = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name,
        password,
      };
      updateUserAPI(updatedUser)
        .then(data => {
          signIn(data);
        })
        .catch(e => alert(e.response.data.message));
    } else {
      const login = unmaskedPhone;
      registrationAPI(name, login, password, unmaskedPhone)
        .then(data => {
          signIn(data);
        })
        .catch(e => alert(e.response.data.message));
    }
  };

  const signIn = user => {
    dispatch(loginAction(user));
    dispatch(setPhoneAction(null));
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader title="??????????????????????" />
      <KeyboardAvoidingWrapper>
        <View style={{ marginHorizontal: 24 }}>
          <View style={styles.logoContainer}>
            <Image
              source={IMAGES.logo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
          {!verified ? (
            <>
              <Text style={styles.titleText}>?????????????????????? ??????????</Text>
              <TouchableOpacity
                style={styles.link}
                onPress={() => navigation.goBack()}>
                <Text style={styles.linkText1}>
                  {`???? ?????????????????? SMS ?? ??????????\n???? ?????????? ${maskedPhone} ??? `}
                  <Text style={styles.linkText2}>????????????????</Text>
                </Text>
              </TouchableOpacity>
              <Input
                placeholder="?????? ??????????????????????????"
                onChangeText={setCode}
                value={code}
                returnKeyType="done"
                keyboardType="numeric"
                onSubmitEditing={verify}
                blurOnSubmit={false}
                maxLength={4}
              />
              <Button
                text="??????????"
                onPress={verify}
                disabled={code.length < 4}
                style={{ marginBottom: 16 }}
              />
              {attemptInterval === 0 ? (
                <TouchableOpacity style={styles.link} onPress={createCode}>
                  <Text style={styles.linkText2}>?????????????????? ??????????</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>
                  {`SMS ???????????? ?? ?????????????? ${minutes}:${seconds}`}
                </Text>
              )}
            </>
          ) : (
            <>
              <Input
                placeholder="???????? ??????"
                onChangeText={setName}
                value={name}
                returnKeyType="next"
                onSubmitEditing={() => refPasswordInput.current.focus()}
                blurOnSubmit={false}
              />
              <View>
                <Input
                  placeholder="????????????"
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry={hidePassword}
                  returnKeyType="done"
                  onSubmitEditing={signUp}
                  ref={refPasswordInput}
                  style={{ paddingRight: 100 }}
                />
                <TouchableOpacity
                  style={styles.inputLink}
                  onPress={() =>
                    setHidePassword(hidePassword => !hidePassword)
                  }>
                  <Text style={styles.inputLinkText}>
                    {hidePassword ? '????????????????' : '????????????'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Button
                text="????????????????????????????????????"
                onPress={signUp}
                disabled={!name || !password}
              />
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

export default RegistrationTwo;
