import React, { useState } from 'react';
import { View, Text } from 'react-native';

const LoginScreen = () => {
  const [message, setMessage] = useState('hola');
  // setMessage('hola');
  return (
    <View>
      <View>
        <Text>{message}</Text>
      </View>
    </View>
  );
};

export default LoginScreen;
