import React from 'react';
import {View, Text, TouchableOpacity, Platform, Image} from 'react-native';

import ImagePickerSelect from './ImagePickerSelect';
import ImagePicker from './ImagePickerNative';
import styles from '../../styles';

const Component = ({disabled}) => {
  const [image, setImage] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const openCamera = () => {
    ImagePicker.openCamera()
      .then(image => {
        if (image && image.uri) setImage(image.uri);
        if (image && image.path) setImage(image.path);
        closeHandler();
      })
      .catch(e => console.log('error', e));
  };

  const openPhotoLib = () => {
    ImagePicker.openPhotoLib()
      .then(image => {
        if (image && image.uri) setImage(image.uri);
        if (image && image.path) setImage(image.path);
        closeHandler();
      })
      .catch(e => console.log('error', e));
  };

  const openModal = () =>
    Platform.OS == 'web' ? openPhotoLib() : setModalVisible(true);

  const closeHandler = () => setModalVisible(false);

  return (
    <View style={styles.CameraContainer}>
      {image && (
        <Image
          source={{uri: image}}
          style={{width: 80, height: 80, borderRadius: 5, marginRight: 10}}
        />
      )}

      <TouchableOpacity
        activeOpacity={Boolean(disabled) ? 1 : 0}
        onPress={() => (Boolean(disabled) ? false : openModal())}>
        {/* <View style={styles.CameraCameraIcon}>
          <Image
            resizeMode="contain"
            style={{width: 15, height: 13}}
            source={require('../../assets/CameraIcon.png')}
          />
        </View> */}
        <View style={styles.CameraAvaIcon}>
          <Image
            resizeMode="contain"
            style={{width: 50, height: 40}}
            source={require('../../assets/AvaIcon.png')}
          />
        </View>
      </TouchableOpacity>

      <ImagePickerSelect
        visible={modalVisible}
        close={closeHandler}
        openPhotoLib={openPhotoLib}
        openCamera={openCamera}
      />
    </View>
  );
};

export default Component;
