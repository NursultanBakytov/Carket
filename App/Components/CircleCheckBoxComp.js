import React, {Component} from 'react';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';

export default class CircleCheckBoxComp extends Component {
  render() {
    return (
      <CircleCheckBox
        checked={this.props.state}
        filterSize={18}
        outerColor="#ececec"
        innerColor="#EA4F3D"
        filterColor="#d7d7d7"
        onToggle={() => this.props.setState(!this.props.state)}
        labelPosition={
          this.props.textLeft ? LABEL_POSITION.LEFT : LABEL_POSITION.RIGHT
        }
        label={this.props.label}
        styleLabel={{color: '#A7A7A7', fontSize: 16, marginLeft: 20}}
      />
    );
  }
}
