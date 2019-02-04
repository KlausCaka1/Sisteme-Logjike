import React, { Component } from 'react';
import { 
    View,
    Text,
    TouchableHighlight,
    Button
} from 'react-native';
import Style from './Style';

export default class InputButton extends Component {
  
    render() {
      return (
          
            <TouchableHighlight 
              style={[Style.inputButton, this.props.highlight ? Style.inputButtonHighh : null ]}
              underlayColor='#193441'
              onPress={this.props.onPress}
            >
              <Text style={Style.inputButtonText}>{this.props.value}</Text>
            </TouchableHighlight>
      )
  }
}