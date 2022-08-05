import axios from 'axios';
import { API } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const $host = axios.create({
  baseURL: API.SERVER_API_URL,
});

const $authHost = axios.create({
  baseURL: API.SERVER_API_URL,
});

const authInterceptor = async config => {
  const token = await AsyncStorage.getItem('@token');
  config.headers.authorization = `Bearer ${token}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
