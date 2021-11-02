import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

const Filter = ({data, Item, setItem}) => {
  const window = Dimensions.get('window');
  const [width, setwidth] = useState(window.width);
  useEffect(() => {
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setwidth(width);
      } else {
        setwidth(width);
      }
      setwidth(width);
    });
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        height: 40,
        marginTop: 43,
        backgroundColor: '#f4f6f8',
        borderRadius: 10,
        alignSelf: 'center',
      }}
      contentContainerStyle={{
        padding: 2,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {data ? (
        data.map((e, key) => (
          <TouchableOpacity
            onPress={() => setItem(e)}
            activeOpacity={1}
            key={key}
            style={{
              alignItems: 'center',
              zIndex: Item === e.id ? 1 : 0,
              backgroundColor: Item === e.id ? 'white' : 'rgba(0,0,0,0.0)',
              height: Item === e.id ? 36 : 20,
              justifyContent: 'center',
              borderRadius: Item === e.id ? 9 : 0,
              borderColor: Item === e.id ? 'rgba(0,0,0,0.0)' : '#DFDFDF',
              marginRight:
                Item === e.id
                  ? 0
                  : Item === e.id + 1
                  ? 0
                  : Item === e.id - 1
                  ? 0
                  : data.length === key + 1
                  ? 0
                  : 0,
              borderRightWidth:
                Item === e.id
                  ? 0
                  : Item === e.id + 1
                  ? 0
                  : data.length === key + 1
                  ? 0
                  : 0.3,
            }}
            onPress={() => {
              setItem(e);
            }}>
            <Text
              style={{
                color: 'black',
                paddingLeft: key === 0 ? 30 : 20,
                paddingRight: data.length === key + 1 ? 10 : 16,
              }}>
              {e.name}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <View />
      )}
    </ScrollView>
  );
};

export default Filter;
