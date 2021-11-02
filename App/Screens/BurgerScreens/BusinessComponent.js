import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-shadow-cards';

const BusinessComponent = ({data, Item, mtop, setItem}) => {
  const setItemFilter = Item => {
    setItem(Item);
  };
  return (
    <View
      style={{
        paddingHorizontal: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        minHeight: 100,
      }}>
      {data.map((e, key) => (
        <Card
          backgroundColor="white"
          key={key}
          elevation={10}
          style={{
            marginTop: mtop || 40,
            width: 160,
            height: 38,
            borderRadius: 10,
            marginRight:
              e.name === '1 месяц' ? 15 : e.name === '6 месяцев' ? 15 : 0,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            key={key}
            style={{
              alignSelf: 'center',
              width: 160,
              height: 38,
              backgroundColor: Item === e.name ? '#EA4F3D' : 'rgba(0,0,0,0.0)',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              flexDirection: 'row',
            }}
            onPress={() => {
              setItemFilter(e.name);
            }}>
            <Text
              style={{
                color: Item === e.name ? 'white' : 'black',
              }}>
              {e.name}
            </Text>
            {e.procent && (
              <Text
                style={{
                  width: 43,
                  height: 22,
                  marginLeft: 5,
                  borderRadius: 27,
                  alignSelf: 'center',
                  paddingTop: 2,
                  paddingLeft: 10,
                  color: Item === e.name ? 'black' : 'white',
                  backgroundColor: Item === e.name ? 'white' : '#EA4F3D',
                }}>
                {e.procent}
              </Text>
            )}
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  );
};

export default BusinessComponent;
