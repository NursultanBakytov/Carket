import React from 'react';
import {Image} from 'react-native';
import CheckBox from 'react-native-check-box';
import styles from '../styles';

const CheckboxComponent = ({onClick, isChecked, text, textStyle, style}) => {
  return (
    <CheckBox
      style={style || {padding: 10}}
      onClick={Boolean(onClick) ? onClick : () => {}}
      isChecked={isChecked}
      leftText={text}
      leftTextStyle={textStyle || {fontSize: 18, color: 'black'}}
      checkedImage={
        <Image
          source={require('../assets/checked.png')}
          style={styles.CheckBoxImg}
        />
      }
      unCheckedImage={
        <Image
          source={require('../assets/unchecked.png')}
          style={styles.CheckBoxImg}
        />
      }
    />
  );
};

export default CheckboxComponent;
