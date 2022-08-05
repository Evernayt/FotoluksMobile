import api from '../constants/api';

export const uploadFilesAPI = async (formData, name, phone, avatar) => {
  const route = `${api.SERVER_API_URL}api/uploadFile/upload/?name=${name}&phone=${phone}&avatar=${avatar}`;
  const res = await fetch(route, {
    method: 'POST',
    body: formData,
  });
  return res;
};

export const uploadAvatarAPI = async formData => {
  const route = `${api.SERVER_API_URL}api/uploadFile/avatar/`;
  const res = await fetch(route, {
    method: 'POST',
    body: formData,
  });
  return res;
};
