import React from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';

export const loader = (
  <ActivityIndicator
    style={{
      position: 'absolute',
      zIndex: 2,
      flex: 1,
      width: Dimensions.get('window').width,
      height: '100%',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: 'rgb(50,52,63)',
    }}
    size="large"
    color="#FFF"
  />
);
export const loaderLight = (
  <ActivityIndicator
    style={{
      position: 'absolute',
      zIndex: 2,
      flex: 1,
      width: Dimensions.get('window').width,
      height: '100%',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: '#FFF',
    }}
    size="large"
    color="#EA4F3D"
  />
);

export const load = <ActivityIndicator size="large" color="#EA4F3D" />;
export const noData = (
  <Text
    style={{
      color: 'rgb(112, 118, 135)',
      fontSize: 18,
      width: '100%',
      textAlign: 'center',
      padding: 10,
    }}>
    Нет данных
  </Text>
);
