import React from 'react';
import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';

import styles from '../styles';

const CustomInput = ({
  value,
  onChange,
  Title,
  Placeholder,
  security,
  WIDTH,
  HEIGHT,
  login,
  isFocused,
  ...props
}) => {
  const [ValueFocused, setValueFocused] = React.useState(false);
  return (
    <View
      style={[
        styles.LoginInputBlock,
        {width: WIDTH || '90%', height: HEIGHT || 44},
      ]}>
      {Boolean(ValueFocused) && (
        <Text style={{color: '#9C9C9C', fontSize: 10}}>{Title}</Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TextInput
          {...props}
          onFocus={() => {
            setValueFocused(!ValueFocused);
          }}
          onBlur={() => {
            setValueFocused(!ValueFocused);
          }}
          value={value}
          onChangeText={onChange}
          placeholder={Placeholder}
          secureTextEntry={security ? true : false}
          placeholderTextColor="#9C9C9C"
          style={{
            marginBottom: ValueFocused ? 20 : -35,
            color: 'black',
            paddingLeft: -5,
            width: '95%',
            paddingVertical: 0,
          }}
          di
        />
      </View>
    </View>
  );
};

export default CustomInput;
