import { $host } from './index';

export const fetchShopsAPI = async () => {
  const { data } = await $host.get('api/shop/all');
  return data;
};
