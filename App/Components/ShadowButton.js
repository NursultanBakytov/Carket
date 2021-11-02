import React, {Component} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import styles from '../styles';

export default class ShadowButton extends Component {
  render() {
    return (
      <Card
        style={[
          this.props.fixed ? styles.FixedButon : styles.AllButtonContainer,
          {width: this.props.width || '90%'},
        ]}>
        {this.props.isLoading ? (
          <ActivityIndicator
            animating={this.props.isLoading}
            size="small"
            color="#ffffff"
          />
        ) : (
          <TouchableOpacity
            style={styles.AllButtonButton}
            onPress={this.props.Press}>
            <Text style={styles.AllButtonText}>{this.props.text}</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  }
}
