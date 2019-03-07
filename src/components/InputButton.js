import React from 'react';
import { Text, TouchableHighlight, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default function InputButton({ value, onPress }) {
  return (
    <TouchableHighlight
      style={styles.inputButton}
      underlayColor="#193441"
      onPress={() => onPress(value)}
    >
      <Text style={styles.inputButtonText}>{value}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  inputButton: {
    flex: 1,
    height: height / 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#435e6c'
  },
  inputButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white'
  }
});
