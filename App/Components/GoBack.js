import React, {Component} from 'react';
import {TouchableOpacity, Image} from 'react-native';

export default class GoBack extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.navigation}
        style={{width: 40, height: 40, marginLeft: 10}}>
        <Image
          style={{width: 20, height: 20, marginTop: 10}}
          source={require('../assets/arrowLeft.png')}
        />
      </TouchableOpacity>
    );
  }
}
