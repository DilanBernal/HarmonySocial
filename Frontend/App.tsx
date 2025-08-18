import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import LoginScreen from './src/screens/LoginScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
