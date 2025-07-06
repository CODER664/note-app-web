import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Note } from '@/types/note';

export const NoteItem = ({ note }: { note: Note }) => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push({ pathname: '/note/[id]', params: { id: note.id } })}>
      {({ pressed }) => (
        <View style={[styles.container, pressed && { opacity: 0.6 }]}>
          <Text style={styles.title}>{note.title || 'Untitled'}</Text>
          <Text style={styles.preview} numberOfLines={2}>
            {note.content}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  preview: {
    color: '#555',
  },
});
