import React from 'react';
import {View, Text, Modal, TouchableOpacity, Platform} from 'react-native';

const Component = ({visible, close, openCamera, openPhotoLib}) => {
  const comp =
    Platform.OS == 'web' ? (
      <View></View>
    ) : (
      <TouchableOpacity
        style={{backgroundColor: '#FFFFFF', alignItems: 'center'}}>
        <TouchableOpacity
          style={{padding: 20, paddingLeft: 40, paddingRight: 40}}
          onPress={openPhotoLib}>
          <Text>Открыть галерею</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{padding: 20}} onPress={openCamera}>
          <Text>Открыть камеру</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{padding: 30}} onPress={close}>
          <Text>Отмена</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      onPress={close}
      visible={visible}>
      <TouchableOpacity
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
        }}
        onPress={close}>
        {comp}
      </TouchableOpacity>
    </Modal>
  );
};

export default Component;
