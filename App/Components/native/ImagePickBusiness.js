import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import {useDispatch} from 'react-redux';

import ImagePickerSelect from './ImagePickerSelect';
import ImagePicker from './ImagePickerNative';
import styles from '../../styles';
import {setData} from '../../Store';

const ImagePickerAdd = ({ToastShow, image, setImage}) => {
  const dispatch = useDispatch();
  const WIDTH = Dimensions.get('window').width - 35;
  const [modalVisible, setModalVisible] = React.useState(false);

  const openCamera = () => {
    ImagePicker.openCamera()
      .then(image => {
        if (image) {
          let arr = image.path.split('/');
          setImage({
            name: arr[arr.length - 1],
            type: image.mime,
            uri: image.path,
          });
        }
        closeHandler();
      })
      .catch(e => console.log('error', e));
  };

  const openPhotoLib = () => {
    ImagePicker.openPhotoLib()
      .then(image => {
        if (image) {
          let arr = image.path.split('/');
          setImage({
            name: arr[arr.length - 1],
            type: image.mime,
            uri: image.path,
          });
        }
        closeHandler();
      })
      .catch(e => console.log('error', e));
  };

  const openModal = () => {
    if (Boolean(image)) {
      return ToastShow('Можно добавить максимум 1шт', 2000, 'error');
    }
    Platform.OS == 'web' ? openPhotoLib() : setModalVisible(true);
  };
  const closeHandler = () => setModalVisible(false);

  return (
    <View style={[styles.CameraContainer, {flexDirection: 'column'}]}>
      <View
        style={{
          minHeight: 80,
          backgroundColor: '#EEEEEE',
          width: WIDTH,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 13,
        }}>
        <TouchableOpacity onPress={openModal}>
          <Image
            resizeMode="contain"
            style={{width: 24, height: 24, alignSelf: 'center'}}
            source={require('../../assets/BusinessCameraIcon.png')}
          />
          <View style={styles.CameraBusinessAvaIcon}>
            <Text style={{color: '#636363', marginTop: 13}}>
              Добавить изображение
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <ImagePickerSelect
        visible={modalVisible}
        close={closeHandler}
        openPhotoLib={openPhotoLib}
        openCamera={openCamera}
      />
    </View>
  );
};

export default ImagePickerAdd;
