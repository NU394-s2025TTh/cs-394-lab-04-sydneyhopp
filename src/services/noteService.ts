// REFERENCE SOLUTION - Do not distribute to students
// src/services/noteService.ts
// TODO: Import functions like setDoc, deleteDoc, onSnapshot from Firebase Firestore to interact with the database
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';

// TODO: Import the Firestore instance from your Firebase configuration file
import { db } from '../firebase-config';
import { Note, Notes } from '../types/Note';
// remove when you use the collection in the code

const NOTES_COLLECTION = 'notes';

/**
 * Creates or updates a note in Firestore
 * @param note Note object to save
 * @returns Promise that resolves when the note is saved
 */
// remove when you implement the function

export async function saveNote(note: Note): Promise<void> {
  // TODO: save the note to Firestore in the NOTES_COLLECTION collection
  // Use setDoc to create or update the note document; throw an error if it fails
  try {
    const docRef = doc(db, `${NOTES_COLLECTION}/${note.id}`);
    await setDoc(docRef, note);
  } catch (err) {
    throw new Error(
      `Failed to save note: ${err instanceof Error ? err.message : 'Unknown error'}`,
    );
  } finally {
    console.log(`Note ${note.id} has been saved.`);
  }
}

/**
 * Deletes a note from Firestore
 * @param noteId ID of the note to delete
 * @returns Promise that resolves when the note is deleted
 */
// remove when you implement the function

export async function deleteNote(noteId: string): Promise<void> {
  // TODO: delete the note from Firestore in the NOTES_COLLECTION collection
  // Use deleteDoc to remove the note document; throw an error if it fails
  try {
    const docRef = doc(db, `${NOTES_COLLECTION}/${noteId}`);
    await deleteDoc(docRef);
  } catch (err) {
    throw new Error(
      `Failed to delete note: ${err instanceof Error ? err.message : 'Unknown error'}`,
    );
  } finally {
    console.log(`Note ${noteId} has been deleted.`);
  }
}

/**
 * Transforms a Firestore snapshot into a Notes object
 * @param snapshot Firestore query snapshot
 * @returns Notes object with note ID as keys
 */
export function transformSnapshot(snapshot: QuerySnapshot<DocumentData>): Notes {
  const notes: Notes = {};

  snapshot.docs.forEach((doc) => {
    const noteData = doc.data() as Note;
    notes[doc.id] = noteData;
  });

  return notes;
}

/**
 * Subscribes to changes in the notes collection
 * @param onNotesChange Callback function to be called when notes change
 * @param onError Optional error handler for testing
 * @returns Unsubscribe function to stop listening for changes
 */

export function subscribeToNotes(
  onNotesChange: (notes: Notes) => void,

  onError?: (error: Error) => void,
): Unsubscribe {
  // TODO: subscribe to the notes collection in Firestore
  // Use onSnapshot to listen for changes; call onNotesChange with the transformed notes
  // Handle errors by calling onError if provided
  // Return s proper (not empty) unsubscribe function to stop listening for changes
  const unsubscribe = onSnapshot(
    collection(db, NOTES_COLLECTION),
    (snapshot) => {
      const notes = transformSnapshot(snapshot);
      onNotesChange(notes);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error('Error fetching notes:', error);
      }
    },
  );

  return unsubscribe;
}
