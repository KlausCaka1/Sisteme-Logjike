import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

import InputButton from './components/InputButton';
import styles from './styles';
import simplify from './utils/simplify';

const buttons = ['A', 'B', '<-', 'C', 'D', '+', '!', '(', ')'];

export default class Calculator extends Component {
  state = {
    inputValue: ''
  };

  handleStringInput = symbol => {
    const prevVal = this.state.inputValue;

    this.setState({
      inputValue:
        symbol === '<-' ? prevVal.substring(0, prevVal.length - 1) : prevVal.concat(symbol)
    });
  };

  handleSubmit = () => {
    console.log(simplify());
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.displayRow}>
          <Text style={styles.displayText}>{this.state.inputValue}</Text>
        </View>

        <View style={{ flex: 3 }}>
          <FlatList
            contentContainerStyle={{ flex: 1 }}
            bounces={false}
            data={buttons}
            numColumns={3}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <InputButton key={item} value={item} onPress={this.handleStringInput} />
            )}
          />
        </View>

        <InputButton style={{ flex: 1 }} value={'='} onPress={this.handleSubmit} />
      </View>
    );
  }
}
