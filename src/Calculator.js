import React, { Component } from 'react';
import { View, Text, FlatList, LayoutAnimation, UIManager } from 'react-native';

import InputButton from './components/InputButton';
import styles from './styles';
import simplify from './utils/simplify';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const buttons = ['A', 'B', '<-', 'C', 'D', '+', '!', '(', ')'];

export default class Calculator extends Component {
  state = {
    inputValue: '',
    resultPreview: '',
    hasError: false
  };

  handleStringInput = symbol => {
    const { inputValue } = this.state;
    const nextInputValue =
      symbol === '<-' ? inputValue.substring(0, inputValue.length - 1) : inputValue.concat(symbol);

    let nextResult = '';

    try {
      nextResult = simplify(nextInputValue);
    } catch (error) {
      console.log(error);
    }

    LayoutAnimation.easeInEaseOut();
    this.setState({
      inputValue: nextInputValue,
      resultPreview: nextInputValue ? nextResult || '0' : '',
      hasError: nextResult === ''
    });
  };

  handleSubmit = () => {
    const { resultPreview } = this.state;

    if (resultPreview !== '') {
      LayoutAnimation.easeInEaseOut();
      this.setState({ inputValue: resultPreview, resultPreview: '' });
    }
  };

  render() {
    const { inputValue, resultPreview, hasError } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.displayRow}>
          <Text style={styles.displayText}>{inputValue}</Text>

          {(!!resultPreview || hasError) && (
            <Text style={[styles.displayText, styles.previewDisplayText]}>
              {resultPreview || ' '}
            </Text>
          )}
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
