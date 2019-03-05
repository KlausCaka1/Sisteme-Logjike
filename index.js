import { AppRegistry } from 'react-native';
import main from './src/Calculator';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => main);
