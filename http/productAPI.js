import { $authHost, $host } from './index';

export const fetchCategoriesWithMinPriceAPI = async () => {
  const { data } = await $host.get('api/category/allWithMinPrice');
  return data;
};

export const fetchTypesAPI = async productId => {
  const { data } = await $host.get('api/type/all/' + productId);
  return data;
};
