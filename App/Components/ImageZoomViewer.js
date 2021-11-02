import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageZoomViewer = ({data, press, index, setIndex}) => {
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <TouchableOpacity
        activeOpacity={1}
        style={{alignSelf: 'flex-end', marginTop: 20, marginRight: 20}}
        onPress={press}>
        <Image
          style={{width: 20, height: 20}}
          source={require('../assets/X.png')}
        />
      </TouchableOpacity>
      {/* <View style={{marginBottom: width / 4}} /> */}
      <ImageViewer
        index={index}
        onChange={setIndex}
        imageUrls={data}
        enableSwipeDown={true}
        onSwipeDown={press}
      />
    </View>
  );
};
export default ImageZoomViewer;

const styless = StyleSheet.create({
  wrapper: {width: 290},
  arrow: {
    width: 24,
    width: 24,
    backgroundColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  arrowContainer: {width: 24, width: 24},
  arrowContainerView: {justifyContent: 'center', alignItems: 'center'},
  arrowContainerText: {
    fontSize: 10,
    color: 'white',
    marginTop: 8,
    alignSelf: 'center',
  },
  arrowLine: {
    width: 1,
    width: 48,
    backgroundColor: 'white',
    marginHorizontal: -15,
  },
});
