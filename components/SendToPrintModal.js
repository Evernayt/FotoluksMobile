import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DocumentPicker, { isInProgress } from 'react-native-document-picker';
import Modal from 'react-native-modal';
import { COLORS, FONTS, ICONS, SIZES } from '../constants';

const buttonSize = (SIZES.width - 44) / 2;
const iconSize = buttonSize * 0.52;

const SendToPrintModal = ({ isShowing, hide }) => {
  const navigation = useNavigation();

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

  const handleError = err => {
    if (DocumentPicker.isCancel(err)) {
      //console.warn('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  const openPhotos = async () => {
    hide();
    await DocumentPicker.pick(imgOptions)
      .then(res => {
        navigation.navigate('Files', { resFiles: res, fileType: 'img' });
      })
      .catch(handleError);
  };

  const openDocuments = async () => {
    hide();
    await DocumentPicker.pick(docOptions)
      .then(res => {
        navigation.navigate('Files', { resFiles: res, fileType: 'doc' });
      })
      .catch(handleError);
  };

  return (
    <Modal
      isVisible={isShowing}
      style={{ margin: 0 }}
      onSwipeComplete={hide}
      swipeDirection={'down'}
      useNativeDriver={false}
      propagateSwipe={true}>
      <View style={styles.container}>
        <View style={styles.panel}>
          <View style={styles.titleContainer}>
            <View style={styles.swipeLine} />
            <Text style={styles.title}>Что отправить?</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={openPhotos}>
                <Image source={ICONS.photo} style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Фотографии</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={openDocuments}>
                <Image source={ICONS.document} style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Документы</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  panel: {
    height: '50%',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    paddingHorizontal: 10,
  },
  swipeLine: {
    height: 6,
    width: 50,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    position: 'absolute',
    top: -12,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 18,
    marginVertical: 24,
    color: COLORS.primaryText,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginHorizontal: 6,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.primaryText,
    marginTop: 12,
  },
  icon: {
    width: iconSize,
    height: iconSize,
  },
});

export default SendToPrintModal;
