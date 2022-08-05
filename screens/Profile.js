import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginAction, logoutAction } from '../store/userReducer';
import {
  Button,
  Input,
  KeyboardAvoidingWrapper,
  NavigationHeader,
} from '../components';
import { COLORS, FONTS, ICONS, IMAGES, SIZES } from '../constants';
import { MaskedText } from 'react-native-mask-text';
import { updateUserAPI } from '../http/userAPI';
import DocumentPicker, { isInProgress } from 'react-native-document-picker';
import { uploadAvatarAPI } from '../http/uploadFileAPI';

const Profile = () => {
  const user = useSelector(state => state.user.user);

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.name);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [avatarData, setAvatarData] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const width = (SIZES.width - 56) / 2;

  const imgOptions = {
    allowMultiSelection: true,
    type: 'image/jpeg',
  };

  const handleError = err => {
    if (DocumentPicker.isCancel(err)) {
      //console.warn('cancelled')
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    removeToken();
    navigation.navigate('Home');
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('@token');
    } catch (e) {
      console.log(e);
    }
  };

  const editAvatar = async () => {
    await DocumentPicker.pickSingle(imgOptions)
      .then(res => {
        setAvatar(res.uri);
        setAvatarData(res);
      })
      .catch(handleError);
  };

  const save = () => {
    if (!name) return;
    if (avatarData) {
      const formData = new FormData();
      const image = {
        uri: avatarData.uri,
        type: avatarData.type,
        name: avatarData.name,
      };
      formData.append('avatar', image);

      uploadAvatarAPI(formData)
        .then(res => res.text())
        .then(data => {
          console.log(data);
          updateUser(data);
        })
        .catch(e => {
          alert(e.response.data.message);
        });
    } else {
      updateUser();
    }
  };

  const updateUser = uploadedAvatar => {
    let editedUser;
    if (uploadedAvatar) {
      editedUser = {
        ...user,
        name,
        avatar: uploadedAvatar,
      };
    } else {
      editedUser = {
        ...user,
        name,
      };
    }

    updateUserAPI(editedUser)
      .then(data => {
        console.log(data);
        dispatch(loginAction(data));
      })
      .catch(e => {
        alert(e.response.data.message);
      });
    setEdit(false);
  };

  const cancel = () => {
    setName(user?.name);
    setAvatar(user?.avatar);
    setAvatarData(null);
    setEdit(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader title="Профиль" />
      {edit ? (
        <View style={styles.insideContainer}>
          <KeyboardAvoidingWrapper>
            <View style={styles.infoContainer}>
              <TouchableOpacity onPress={editAvatar}>
                <View style={styles.avatarEditContainer}>
                  <Image source={ICONS.edit} style={styles.avatarEdit} />
                </View>
                <Image
                  source={user?.avatar ? { uri: avatar } : IMAGES.avatar}
                  style={styles.avatar}
                />
              </TouchableOpacity>

              <Input
                value={name}
                onChangeText={setName}
                style={{ width: '100%' }}
                placeholder="Ваше имя"
              />
            </View>
          </KeyboardAvoidingWrapper>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              text="Отмена"
              style={{ backgroundColor: COLORS.secondary, width: width }}
              onPress={cancel}
            />
            <Button text="Сохранить" style={{ width: width }} onPress={save} />
          </View>
        </View>
      ) : (
        <View style={styles.insideContainer}>
          <View style={styles.infoContainer}>
            <Image
              source={user?.avatar ? { uri: user.avatar } : IMAGES.avatar}
              style={styles.avatar}
            />
            <Text style={styles.nameText}>{user?.name}</Text>
            <MaskedText mask="9 (999) 999-99-99" style={styles.phoneText}>
              {user?.phone}
            </MaskedText>
          </View>
          <Button
            text="Редактировать"
            style={{ marginBottom: 16 }}
            onPress={() => setEdit(true)}
          />
          <Button
            text="Выйти из аккаунта"
            style={{ backgroundColor: COLORS.secondary }}
            onPress={logout}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  insideContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 12,
  },
  avatar: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 75,
    marginBottom: 24,
  },
  nameText: {
    fontFamily: FONTS.medium,
    fontSize: 22,
    color: COLORS.primaryText,
  },
  phoneText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    marginTop: 12,
    color: COLORS.secondaryText,
  },
  avatarEditContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    zIndex: 1,
    height: 150,
    width: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEdit: {
    width: 32,
    height: 32,
  },
});

export default Profile;
