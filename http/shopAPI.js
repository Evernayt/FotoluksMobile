import { $host } from './index';

export const fetchShopsAPI = async () => {
  const { data } = await $host.post('api/shop/all');
  return data;
};
