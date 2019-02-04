import React, {Component } from 'react';
import { View, 
    Text, 
    Button, 
    TouchableOpacity 
} from 'react-native';

import InputButton from './InputButton';
import Style from './Style';

const InputButtons = [
    ['A','B', '<-'],
    ['C','D', '+'],
    ['!','(',')'],
    ['=']
];

export default class main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputValue: "",
            previousInputValue: 0,
            selectSymbol: null
        }
    }
    
    render() {
        return (
        <View style={Style.rootContainer}>
            <View style={Style.displayInput}>
             <Text style={Style.displayText}>{this.state.inputValue}</Text>
            </View>
            <View style={Style.buttons}>
             {this._renderInputButtons()}
            </View>
        </View>
        )
    }
    _renderInputButtons() {
        let views = [];

        for (var r = 0; r < InputButtons.length; r++){
            let row = InputButtons[r];

            let inputRow = [];
            for (var i = 0; i < row.length; i++){
                let input = row[i];

                inputRow.push(
                    <InputButton 
                    value={input} 
                    highlight={this.state.selectedSymbol == input}
                    onPress={this._onInputButtonPress.bind(this, input)}
                    key={r + "-" + i} />
                );
            }
          
        views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>)
        }
        
        return views;
    }
      _onInputButtonPress(input) {
            switch (typeof input) {
                case 'string' :
                  return this._handelStringInput(input)
            }
        }
        _handelStringInput(str){
            switch (str) {
                case 'A' :
                case 'B' :
                case 'C' :
                case 'D' :
                case '(' :
                case ')' :  
                case '+' :
                case '<-' :
                case '=' :
                case '!' :
                 let strin = (this.state.inputValue) + str;
                 if (str === '=') {
                     alert(strin);
                     strin = "";
                 }
                 else if (str === '<-') {
                    strin = strin.slice(1, strin.indexOf('<-'));
                 }
                 this.setState({
                     selectSymbol: "",
                     previousInputValue: this.state.previousInputValue,
                     inputValue: strin
                 });
                 break;
            }
        }

}
