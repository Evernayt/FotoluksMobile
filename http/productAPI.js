import { $authHost, $host } from './index';

export const fetchCategoriesAPI = async () => {
  const { data } = await $host.get('api/category/all');
  return data;
};

export const fetchTypesAPI = async productId => {
  const { data } = await $host.get('api/type/all/' + productId);
  return data;
};
