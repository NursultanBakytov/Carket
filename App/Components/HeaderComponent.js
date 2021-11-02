import React, {Component} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import IMAGE from '../assets/SVG';
import styles from '../styles';

export default class HeaderComponent extends Component {
  render() {
    return (
      <SafeAreaView>
        <View
          style={[
            styles.HeaderComponentBlock,
            {
              justifyContent: this.props.favorit
                ? 'space-between'
                : 'flex-start',
            },
          ]}>
          {this.props.arrow && (
            <TouchableOpacity
              style={{marginRight: 15, width: 25}}
              onPress={() => {
                return Boolean(this.props.autos)
                  ? this.props.navigation.navigate('Autos')
                  : this.props.navigation.goBack();
              }}>
              {IMAGE.ArrowLeft}
            </TouchableOpacity>
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{width: '90%'}}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                return Boolean(this.props.autos)
                  ? this.props.navigation.navigate('Autos')
                  : this.props.navigation.goBack();
              }}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{color: 'white', fontSize: 16}}>
                {this.props.title}
              </Text>
            </TouchableOpacity>
          </ScrollView>
          {this.props.favorit && (
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() =>
                this.props.setFavoritPress(!this.props.favoritPress)
              }>
              <View style={{marginTop: 2}}>
                {this.props.favoritPress
                  ? IMAGE.AutoFavoritIcon
                  : IMAGE.AutoUnFavoritIcon}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
