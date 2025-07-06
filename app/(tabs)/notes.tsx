import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useNotes } from '@/contexts/NotesContext';
import { NoteItem } from '@/components/NoteItem';

export default function NotesListScreen() {
  const { notes } = useNotes();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteItem note={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No notes yet</Text>}
        contentContainerStyle={notes.length === 0 && { flex: 1, justifyContent: 'center' }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/note/new')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { textAlign: 'center', color: '#666' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#0a84ff',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  fabText: { color: 'white', fontSize: 28, lineHeight: 30 },
});
