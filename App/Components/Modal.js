import React from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';

const ModalComp = ({visible, setVisible, data, setText}) => (
  <Modal
    transparent={true}
    animationType="slide"
    visible={visible}
    onRequestClose={() => setVisible(false)}>
    <TouchableOpacity
      onPress={() => setVisible(false)}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
      }}>
      <View style={{backgroundColor: 'white'}}>
        {data.map((item, key) => (
          <Text
            onPress={() => {
              setText(item.text);
              setVisible(false);
            }}
            key={key}
            style={{fontSize: 18, color: 'black', margin: 20}}>
            {item.text}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>
);

export default ModalComp;
