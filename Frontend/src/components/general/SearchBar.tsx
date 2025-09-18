import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onClear?: () => void;
};

export default function SearchBar({ value, onChangeText, placeholder='Buscar canciones, artistas o amigos', autoFocus, onClear }: Props) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#101425',
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 44,
      borderWidth: 1,
      borderColor: '#1f2438'
    }}>
      <Icon name="search" size={20} color="#9aa3b2" />
      <TextInput
        style={{ flex: 1, marginLeft: 8, color: '#fff' }}
        placeholder={placeholder}
        placeholderTextColor="#70778a"
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value?.length ? (
        <Pressable onPress={onClear}>
          <Icon name="close-circle" size={18} color="#9aa3b2" />
        </Pressable>
      ) : null}
    </View>
  );
}
