import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import CircleCheckBox from 'react-native-circle-checkbox';

import CircleCheckBoxComp from '../../Components/CircleCheckBoxComp';

const ServiceComp = ({
  state,
  setState,
  firstText,
  thirdText,
  secondText,
  ml,
  press,
}) => {
  return (
    <View style={[styles.container]}>
      <CircleCheckBox
        checked={state}
        filterSize={18}
        outerColor="#ececec"
        innerColor="#EA4F3D"
        filterColor="#d7d7d7"
        onToggle={press}
      />
      <Text style={styles.firstText}>{firstText}</Text>
      {secondText && <Text style={styles.secondText}>{secondText}</Text>}
      <Text style={[styles.thirdText, {marginLeft: ml}]}>{thirdText}</Text>
    </View>
  );
};

export default ServiceComp;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: -30,
  },
  firstText: {
    fontSize: 16,
    marginLeft: 23,
  },
  secondText: {
    textDecorationLine: 'line-through',
    marginLeft: 151,
    position: 'absolute',
    fontSize: 16,
    color: '#636363',
  },
  thirdText: {color: '#EA4F3D', fontSize: 16, position: 'absolute'},
});
