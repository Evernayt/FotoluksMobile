import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker, { isInProgress } from 'react-native-document-picker';
import {
  Button,
  CircleButton,
  Loader,
  NavigationHeader,
  ShopSelectModal,
} from '../components';
import { COLORS, FONTS, ICONS, SIZES } from '../constants';
import { uploadFilesAPI } from '../http/uploadFileAPI';
import Toast from '@skilopay/react-native-easy-toast';
import { useSelector } from 'react-redux';
import { mask } from 'react-native-mask-text';
import { useModal } from '../hooks';

const itemWidth = (SIZES.width - 64) / 2;
const itemHeight = itemWidth * 1.17;
const checkSize = itemWidth * 0.55;

const Files = ({ route }) => {
  const { resFiles, fileType } = route.params;

  const [files, setFiles] = useState(resFiles);
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector(state => state.user.user);

  const toastRef = useRef();
  const toastErrorRef = useRef();

  const { isShowing, toggle } = useModal();

  const imgOptions = {
    allowMultiSelection: true,
    type: DocumentPicker.types.images,
  };

  const docOptions = {
    allowMultiSelection: true,
    type: [
      DocumentPicker.types.plainText,
      DocumentPicker.types.pdf,
      DocumentPicker.types.csv,
      DocumentPicker.types.doc,
      DocumentPicker.types.docx,
      DocumentPicker.types.xls,
      DocumentPicker.types.xlsx,
    ],
  };

  const editModeOn = name => {
    if (selectedFilesCount > 0) return;
    selectToggle(name);
  };

  const editModeOff = () => {
    setSelectedFilesCount(0);
    setFiles(prevState =>
      prevState.map(state => {
        return { ...state, isSelected: false };
      }),
    );
  };

  const selectToggle = name => {
    let filesCopy = [...files];
    filesCopy = filesCopy.map(file => {
      if (file.name === name) {
        if (file.isSelected) {
          setSelectedFilesCount(prevState => prevState - 1);
          return { ...file, isSelected: false };
        } else {
          setSelectedFilesCount(prevState => prevState + 1);
          return { ...file, isSelected: true };
        }
      } else {
        return file;
      }
    });

    setFiles(filesCopy);
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

  const addFiles = () => {
    DocumentPicker.pick(fileType === 'img' ? imgOptions : docOptions)
      .then(res => {
        let newFiles = [];
        for (let index = 0; index < res.length; index++) {
          const isDublicate = files.find(x => x.name === res[index].name);
          if (!isDublicate) {
            newFiles.push(res[index]);
          }
        }
        setFiles(prevState => [...prevState, ...newFiles]);
      })
      .catch(handleError);
  };

  const deleteFiles = () => {
    setSelectedFilesCount(0);
    setFiles(prevState => prevState.filter(state => state.isSelected !== true));
  };

  const sendFiles = () => {
    toggle();
    setLoading(true);
    const formData = new FormData();

    for (let index = 0; index < files.length; index++) {
      const file = {
        uri: files[index].uri,
        type: files[index].type,
        name: files[index].name,
      };

      formData.append('upload', file);
    }

    const maskedPhone = mask(user.phone, '9 (999) 999-99-99');
    uploadFilesAPI(
      formData,
      user.name,
      maskedPhone,
      user.avatar,
      selectedShop.id,
    )
      .then(res => {
        if (res.ok) {
          toastRef.current.show('Отправлено', 2000);
          setFiles([]);
        } else {
          toastErrorRef.current.show('Ошибка: не удалось отправить', 2000);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getExtensionColor = extension => {
    if (extension === 'PDF') {
      return '#EF4836';
    } else if (extension === 'CSV') {
      return '#03C9A8';
    } else if (extension === 'DOC' || extension === 'DOCX') {
      return '#446CB2';
    } else if (extension === 'XLS' || extension === 'XLSX') {
      return '#2DCC70';
    } else {
      return COLORS.secondaryText;
    }
  };

  const renderPhotoItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => selectedFilesCount > 0 && selectToggle(item.name)}
        onLongPress={() => editModeOn(item.name)}>
        {item.isSelected && (
          <View style={styles.imageCheckContainer}>
            <Image source={ICONS.check} style={styles.imageCheck} />
          </View>
        )}
        <Image source={{ uri: item.uri }} style={styles.itemImage} />
      </TouchableOpacity>
    );
  };

  const renderDocumentItem = ({ item }) => {
    const extension = item.name.split('.').pop().toUpperCase();
    const color = getExtensionColor(extension);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.itemContainer}
        onPress={() => selectedFilesCount > 0 && selectToggle(item.name)}
        onLongPress={() => editModeOn(item.name)}>
        <View
          style={[styles.itemExtensionContainer, { backgroundColor: color }]}>
          {item.isSelected && (
            <View style={styles.documentCheckContainer}>
              <Image source={ICONS.check} style={styles.documentCheck} />
            </View>
          )}
          <Text style={styles.itemExtension}>{extension}</Text>
        </View>
        <Text style={styles.itemName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ShopSelectModal
        isShowing={isShowing}
        hide={toggle}
        selectedShop={selectedShop}
        setSelectedShop={setSelectedShop}
        continueButtonText="Отправить"
        continueFunc={sendFiles}
      />
      <Toast ref={toastRef} style={{ backgroundColor: COLORS.success }} />
      <Toast ref={toastErrorRef} style={{ backgroundColor: COLORS.error }} />
      {selectedFilesCount > 0 ? (
        <View style={styles.editHeaderContainer}>
          <CircleButton icon={ICONS.close} onPress={editModeOff} />
          <Text style={styles.editHeaderTitle}>
            Выбрано: {selectedFilesCount}
          </Text>
          <CircleButton icon={ICONS.trash} onPress={deleteFiles} />
        </View>
      ) : (
        <NavigationHeader
          title={fileType === 'img' ? 'Фотографии' : 'Документы'}
          icon={ICONS.add}
          onPress={addFiles}
        />
      )}
      {loading ? (
        <Loader />
      ) : (
        <>
          {files.length > 0 ? (
            <>
              {fileType === 'img' ? (
                <FlatList
                  data={files}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  keyExtractor={item => `${item.name}`}
                  renderItem={renderPhotoItem}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                />
              ) : (
                <FlatList
                  data={files}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => `${item.name}`}
                  renderItem={renderDocumentItem}
                  style={{ marginHorizontal: 24 }}
                />
              )}
            </>
          ) : (
            <View style={styles.noFilesContainer}>
              <Text style={styles.noFilesMessage}>
                {fileType === 'img'
                  ? 'Нет выбранных фотографий'
                  : 'Нет выбранных документов'}
              </Text>
              <Button text="Добавить" onPress={addFiles} />
            </View>
          )}
          <Button
            text={
              fileType === 'img'
                ? 'Отправить фотографии'
                : 'Отправить документы'
            }
            style={{ margin: 16 }}
            disabled={files.length === 0}
            onPress={toggle}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  itemImage: {
    height: itemHeight,
    width: itemWidth,
    borderRadius: SIZES.radius,
    resizeMode: 'cover',
    margin: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  itemExtensionContainer: {
    width: 50,
    height: 50,
    borderRadius: SIZES.radius,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemExtension: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: 'white',
  },
  itemName: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.primaryText,
  },
  imageCheckContainer: {
    height: itemHeight,
    width: itemWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
    position: 'absolute',
    margin: 8,
    borderRadius: SIZES.radius,
  },
  imageCheck: {
    height: checkSize,
    width: checkSize,
  },
  documentCheckContainer: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1,
    position: 'absolute',
    borderRadius: SIZES.radius,
  },
  documentCheck: {
    height: 24,
    width: 24,
  },
  noFilesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFilesMessage: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.secondaryText,
    marginBottom: 24,
  },
  editHeaderContainer: {
    flexDirection: 'row',
    height: 96,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: COLORS.background,
  },
  editHeaderTitle: {
    fontFamily: FONTS.medium,
    fontSize: 22,
    color: COLORS.primaryText,
  },
});

export default Files;
