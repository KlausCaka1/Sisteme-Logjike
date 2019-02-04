/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import main from './src/main.js';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => main);
