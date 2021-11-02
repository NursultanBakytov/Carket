import React, {PureComponent} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Dimensions, Modal, TouchableOpacity} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import ImageZoomViewer from '../../Components/ImageZoomViewer';

const {width} = Dimensions.get('window');

const getPhotos = obj => {
  let newArr = [];

  obj.photos.forEach(url => {
    newArr.push({
      url:
        url.split('/')[0] === 'https:'
          ? url
          : url.split('/')[0] === 'img' || url.split('/')[0] === 'assets'
          ? `https://carket.kg/${url}`
          : `https:${url}`,
    });
  });
  return newArr;
};

class SwiperComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.scrollView = React.createRef(null);
    this.state = {
      modal: false,
      index: 0,
    };
  }

  change(nativeEvent, index) {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== index) {
      this.setState({index: slide});
    }
  }

  render() {
    const {modal, index} = this.state;
    const {page, isLoading, isCurrentAdLoading} = this.props;
    const photos = getPhotos(this.props.ad);
    return (
      <View style={style.container}>
        {/* ----- Start Swiper Modal ----- */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={modal}
          onRequestClose={() => this.setState({modal: false})}>
          <ImageZoomViewer
            index={index}
            setIndex={i => this.setState({index: i})}
            data={photos}
            press={() => {
              this.scrollView.current.scrollTo({
                x: width * index,
                y: 0,
                animated: true,
              });
              this.setState({modal: false});
            }}
          />
        </Modal>
        {/* ----- End Swiper Modal ----- */}
        <ScrollView
          ref={this.scrollView}
          pagingEnabled
          horizontal
          style={style.container}
          onScroll={({nativeEvent}) => this.change(nativeEvent, index)}
          showsHorizontalScrollIndicator={false}>
          {(isLoading && page === 0) || isCurrentAdLoading ? (
            <View style={style.loader}>
              <ActivityIndicator size="large" color="#FFF" />
            </View>
          ) : (
            photos.map((image, i) => (
              <TouchableOpacity
                activeOpacity={1}
                key={i}
                onPress={() => this.setState({modal: true, index: i})}>
                <Image
                  style={style.image}
                  source={{
                    uri: image.url,
                  }}
                />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
        <View style={style.pagination}>
          {photos.map((_, i) => (
            <View
              key={i}
              style={[
                style.pagingDot,
                {backgroundColor: i === index ? '#EA4F3D' : '#C4C4C4'},
              ]}
            />
          ))}
        </View>
        <View style={style.counter}>
          <Svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <Path
              d="M7.371 3.75L5.871 5.25H3V14.25H15V5.25H12.129L10.629 3.75H7.371ZM6.75 2.25H11.25L12.75 3.75H15.75C15.9489 3.75 16.1397 3.82902 16.2803 3.96967C16.421 4.11032 16.5 4.30109 16.5 4.5V15C16.5 15.1989 16.421 15.3897 16.2803 15.5303C16.1397 15.671 15.9489 15.75 15.75 15.75H2.25C2.05109 15.75 1.86032 15.671 1.71967 15.5303C1.57902 15.3897 1.5 15.1989 1.5 15V4.5C1.5 4.30109 1.57902 4.11032 1.71967 3.96967C1.86032 3.82902 2.05109 3.75 2.25 3.75H5.25L6.75 2.25ZM9 13.5C7.90598 13.5 6.85677 13.0654 6.08318 12.2918C5.3096 11.5182 4.875 10.469 4.875 9.375C4.875 8.28098 5.3096 7.23177 6.08318 6.45818C6.85677 5.6846 7.90598 5.25 9 5.25C10.094 5.25 11.1432 5.6846 11.9168 6.45818C12.6904 7.23177 13.125 8.28098 13.125 9.375C13.125 10.469 12.6904 11.5182 11.9168 12.2918C11.1432 13.0654 10.094 13.5 9 13.5ZM9 12C9.69619 12 10.3639 11.7234 10.8562 11.2312C11.3484 10.7389 11.625 10.0712 11.625 9.375C11.625 8.67881 11.3484 8.01113 10.8562 7.51884C10.3639 7.02656 9.69619 6.75 9 6.75C8.30381 6.75 7.63613 7.02656 7.14384 7.51884C6.65156 8.01113 6.375 8.67881 6.375 9.375C6.375 10.0712 6.65156 10.7389 7.14384 11.2312C7.63613 11.7234 8.30381 12 9 12Z"
              fill="white"
            />
          </Svg>
          <Text style={[style.counterText, {marginHorizontal: 5}]}>
            {index + 1} /
          </Text>
          <Text style={style.counterText}>{photos.length}</Text>
        </View>
      </View>
    );
  }
}

export default SwiperComponent;

const style = StyleSheet.create({
  container: {width, height: 280},
  image: {
    width: width,
    height: 240,
    resizeMode: 'cover',
  },
  loader: {
    width: width,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: '#0a0a0a87',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,

    marginHorizontal: 3,
  },
  counter: {
    flexDirection: 'row',
    position: 'absolute',
    right: 8,
    zIndex: 1,
    height: 30,
    marginTop: 10,
    marginLeft: width - 65,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#EA4F3D',
    borderRadius: 7,
  },
  counterText: {color: 'white'},
});
