import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WaruikoNote {
  id: string;
  text: string;
  monsterResponse: string;
  timestamp: number;
  isPurified: boolean;
}

const STORAGE_KEY = 'waruiko_notes';

export const saveNote = async (note: Omit<WaruikoNote, 'id' | 'timestamp'>): Promise<WaruikoNote> => {
  try {
    const newNote: WaruikoNote = {
      ...note,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const existingNotes = await getNotes();
    const updatedNotes = [newNote, ...existingNotes];
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    return newNote;
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
};

export const getNotes = async (): Promise<WaruikoNote[]> => {
  try {
    const notesJson = await AsyncStorage.getItem(STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

export const updateNotePurificationStatus = async (noteId: string, isPurified: boolean): Promise<void> => {
  try {
    const notes = await getNotes();
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isPurified } : note
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Error updating note purification status:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const notes = await getNotes();
    const updatedNotes = notes.filter(note => note.id !== noteId);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const clearAllNotes = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing all notes:', error);
    throw error;
  }
}; 