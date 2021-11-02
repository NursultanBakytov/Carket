import React from 'react';
import {View, Text} from 'react-native';

import {default as RNImagePicker} from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';

const ImagePicker = () => {
  return (
    <View>
      <Text>Image picker Native</Text>
    </View>
  );
};

const openCamera = () => {
  return RNImagePicker.openCamera({
    mediaType: 'photo',
    cropping: true,
  });
};

const openPhotoLib = () => {
  return RNImagePicker.openPicker({
    mediaType: 'photo',
    cropping: true,
  });
};

const openPhotoLibAva = res => {
  return launchImageLibrary({mediaType: 'photo'}, res);
};

export default {
  ImagePicker,
  openCamera,
  openPhotoLib,
  openPhotoLibAva,
};
