import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotes } from '@/contexts/NotesContext';

export default function NoteEditorScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const isNew = id === 'new';
  const router = useRouter();
  const { notes, addNote, updateNote, deleteNote } = useNotes();

  const existing = notes.find((n) => n.id === id);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');

  useEffect(() => {
    if (!isNew && !existing) {
      // note not found – go back
      router.back();
    }
  }, [existing, isNew]);

  const handleSave = async () => {
    if (isNew) {
      await addNote(title, content);
    } else if (id) {
      await updateNote(id, title, content);
    }
    router.back();
  };

  const handleDelete = async () => {
    if (!id) return;
    if (Platform.OS === 'web') {
      if (window.confirm('Delete note?')) {
        await deleteNote(id);
        router.back();
      }
    } else {
      Alert.alert('Delete note', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(id);
            router.back();
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
      />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={styles.contentInput}
        multiline
      />
      <View style={styles.buttonsRow}>
        {!isNew && <Button title="Delete" color="#ff3b30" onPress={handleDelete} />}
        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
  },
  contentInput: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});
