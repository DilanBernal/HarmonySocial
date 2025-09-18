import React from 'react';
import { FlatList, Image, Text, View, Pressable } from 'react-native';

type Story = { id: string; name: string; avatarUrl: string };
type Props = { data: Story[]; onPress?: (s: Story) => void; title?: string };

export default function StoriesRow({ data, onPress, title="Historias" }: Props) {
  if (!data?.length) return null;
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ color: '#9aa3b2', marginHorizontal: 12, marginBottom: 8 }}>{title}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPress?.(item)} style={{ width: 72, marginHorizontal: 6, alignItems: 'center' }}>
            <View style={{
              width: 56, height: 56, borderRadius: 28, overflow: 'hidden',
              borderWidth: 2, borderColor: '#4f46e5'
            }}>
              <Image source={{ uri: item.avatarUrl }} style={{ width: '100%', height: '100%' }} />
            </View>
            <Text style={{ color: '#9aa3b2', fontSize: 12 }} numberOfLines={1}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
