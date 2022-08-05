import { $host } from './index';

export const isVerifiedAPI = async phone => {
  const { data } = await $host.get('api/verification/isVerified/' + phone);
  return data;
};

export const createCodeAPI = async (phone, ip) => {
  const { data } = await $host.post('api/verification/createCode', {
    phone,
    ip,
  });
  return data;
};

export const checkCodeAPI = async (code, phone) => {
  const { data } = await $host.get(
    `api/verification/check/?code=${code}&phone=${phone}`,
  );
  return data;
};

export const verifyAPI = async (code, phone) => {
  const { data } = await $host.get(
    `api/verification/verify/?code=${code}&phone=${phone}`,
  );
  return data;
};
