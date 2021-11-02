import React from 'react';
import {Image, TextInput, View} from 'react-native';
import IMAGE from '../assets/SVG';
const SearchBar = ({...props}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
      }}>
      {IMAGE.SearchIcon}

      <TextInput
        style={{
          paddingHorizontal: 8,
          fontSize: 14,
          fontWeight: '600',
          // display: {...props.value}.length === 0 ? 'none' : 'flex',
          display: 'none',
        }}
        placeholder=""
        {...props}
      />
    </View>
  );
};

export default SearchBar;
