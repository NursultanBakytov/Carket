import {Picker} from '@react-native-picker/picker';
import React, {Component} from 'react';
import {Image, TextInput, TouchableOpacity, View} from 'react-native';

import {load} from '../../Components/Loader';

export default class InputComponent extends Component {
  render() {
    const {value, change, placeholder, PlusPress, noIcon} = this.props;

    return (
      <View
        style={{
          flex: 1,
          marginTop: 13,
          minHeight: 50,
          borderRadius: 7,
          backgroundColor: '#EEEEEE',
          alignItems: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
        }}>
        <TextInput
          {...this.props}
          value={value}
          onChangeText={change}
          style={{flex: 1, width: '95%'}}
          placeholder={placeholder}
        />

        {!noIcon && (
          <TouchableOpacity onPress={PlusPress}>
            <Image
              style={{
                width: 24,
                height: 24,
                transform: [{rotate: '-90deg'}],
              }}
              source={require('../../assets/PlusIcon.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export const SimpleSelect = ({
  setState,
  state,
  data,
  defaultValue,
  valueKey = 'alias',
  isLoading,
}) => {
  return (
    <View style={pickerWrapper}>
      {isLoading ? (
        <Picker
          onValueChange={value => setState(value)}
          selectedValue={state}
          dropdownIconColor="#000000"
          style={pickerStyles}>
          <Picker.Item label={defaultValue} value={defaultValue} />
          {Boolean(data) &&
            data.map(item => (
              <Picker.Item
                label={item.name}
                value={item[valueKey]}
                key={item.alias}
              />
            ))}
        </Picker>
      ) : (
        load
      )}
    </View>
  );
};

export const pickerWrapper = {
  borderRadius: 7,
  width: '100%',
  minHeight: 50,
  backgroundColor: '#EEEEEE',
  overflow: 'hidden',
  marginTop: 13,
  justifyContent: 'center',
  alignItems: 'center',
};
export const pickerStyles = {
  minHeight: 50,
  backgroundColor: '#EEEEEE',
  width: '100%',
};
