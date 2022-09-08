import { $authHost, $host } from './index';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registrationAPI = async (
  name,
  login,
  password,
  phone,
  shopId = 1,
) => {
  const { data } = await $host.post('api/user/registration', {
    name,
    login,
    password,
    phone,
    shopId,
  });
  storeToken(data.token);
  return jwtDecode(data.token);
};

export const loginAPI = async (login, password) => {
  const { data } = await $host.post('api/user/login', { login, password });
  storeToken(data.token);
  return jwtDecode(data.token);
};

export const checkAPI = async () => {
  const { data } = await $authHost.get('api/user/check');
  storeToken(data.token);
  return jwtDecode(data.token);
};

export const updateUserAPI = async user => {
  const { data } = await $host.post('api/user/update', user);
  storeToken(data.token);
  return jwtDecode(data.token);
};

export const updatePasswordAPI = async (login, password) => {
  const { data } = await $host.post('api/user/updatePassword', {
    login,
    password,
  });
  return data;
};

const storeToken = async value => {
  try {
    await AsyncStorage.setItem('@token', value);
  } catch (e) {}
};
