import React, {useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import CircleCheckBoxComp from '../../Components/CircleCheckBoxComp';

const BusinessGraphick = ({
  state,
  setState,
  label,
  setDate,
  date,
  setDateSecond,
  dateSecond,
  setShow,
  show,
  showSecond,
  setShowSecond,
  bussines,
}) => {
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const onChangeSecond = (event, selectedDate) => {
    const currentDatesec = selectedDate || date;
    setShowSecond(Platform.OS === 'ios');
    setDateSecond(currentDatesec);
  };
  return (
    <View style={[styles.container]}>
      <CircleCheckBoxComp state={state} setState={setState} label={label} />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )}
      <TouchableOpacity
        style={styles.firstInput}
        onPress={() => setShow(true)}
        disabled={!state}>
        <Text style={{alignSelf: 'center', color: state ? 'black' : '#A7A7A7'}}>
          {`${
            date.getHours() === 0
              ? '00'
              : `${date.getHours() < 10 ? '0' : ''}${date.getHours()}`
          }:${
            date.getMinutes() === 0
              ? '00'
              : `${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
          }`}
        </Text>
      </TouchableOpacity>
      <Text>-</Text>
      {showSecond && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateSecond}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onChangeSecond}
        />
      )}
      <TouchableOpacity
        style={styles.secondInput}
        onPress={() => setShowSecond(true)}
        disabled={!state}>
        <Text style={{alignSelf: 'center', color: state ? 'black' : '#A7A7A7'}}>
          {`${
            dateSecond.getHours() === 0
              ? '00'
              : `${
                  dateSecond.getHours() < 10 ? '0' : ''
                }${dateSecond.getHours()}`
          }:${
            dateSecond.getMinutes() === 0
              ? '00'
              : `${
                  dateSecond.getMinutes() < 10 ? '0' : ''
                }${dateSecond.getMinutes()}`
          }`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BusinessGraphick;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
  },
  firstInput: {
    width: 120,
    height: 50,
    borderRadius: 7,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 10,
  },
  secondInput: {
    width: 120,
    height: 50,
    borderRadius: 7,
    backgroundColor: '#EEE',
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
