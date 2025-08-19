/**
 * @format
 */

import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';

// import App from './App';
import App from './src/App';   // ← apunta a src/App

import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
