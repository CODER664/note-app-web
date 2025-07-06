import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/types/note';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface NotesContextProps {
  notes: Note[];
  addNote: (title: string, content: string) => Promise<string>; // returns id
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotesContext = createContext<NotesContextProps | undefined>(undefined);

const STORAGE_KEY = 'NOTES_STORAGE_KEY';

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  const persistNotes = async (newNotes: Note[]) => {
    setNotes(newNotes);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
  };

  const refresh = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setNotes(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
  };

  const addNote = async (title: string, content: string) => {
    const id = uuidv4();
    const timestamp = Date.now();
    const newNotes = [
      { id, title, content, createdAt: timestamp, updatedAt: timestamp },
      ...notes,
    ];
    await persistNotes(newNotes);
    return id;
  };

  const updateNote = async (id: string, title: string, content: string) => {
    const newNotes = notes.map((n) =>
      n.id === id ? { ...n, title, content, updatedAt: Date.now() } : n,
    );
    await persistNotes(newNotes);
  };

  const deleteNote = async (id: string) => {
    const newNotes = notes.filter((n) => n.id !== id);
    await persistNotes(newNotes);
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, refresh }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};
