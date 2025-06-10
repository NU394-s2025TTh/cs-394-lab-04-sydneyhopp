// src/components/NoteList.tsx
import { useEffect, useState } from 'react';

import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}
// TODO: remove the eslint-disable-next-line when you implement the onEditNote handler
const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  // TODO: load notes using subscribeToNotes from noteService, use useEffect to manage the subscription; try/catch to handle errors (see lab 3)
  // TODO: handle unsubscribing from the notes when the component unmounts
  // TODO: manage state for notes, loading status, and error message
  // TODO: display a loading message while notes are being loaded; error message if there is an error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [notes, setNotes] = useState<Notes>({});

  useEffect(() => {
    setLoading(true);

    let unsubscribe = () => {};

    try {
      // need to wrap in try catch block
      unsubscribe = subscribeToNotes(
        (updatedNotes) => {
          setNotes(updatedNotes);
          setLoading(false);
        },
        (err) => {
          setError(`Failed to load notes: ${err.message}`);
          setLoading(false);
          console.error('Error loading notes:', err);
        },
      );
    } catch (err) {
      setError(
        `Failed to load notes: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
      setLoading(false);
      console.error('Error loading notes:', err);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Notes is a constant in this template but needs to be a state variable in your implementation and load from firestore
  // const notes: Notes = {
  //   '1': {
  //     id: '1',
  //     title: 'Note 1',
  //     content: 'This is the content of note 1.',
  //     lastUpdated: Date.now() - 100000,
  //   },
  // };

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {loading && <p>Loading notes...</p>}
      {error && <p className="error">Error loading notes: {error}</p>};
      {Object.values(notes).length === 0 ? (
        <p>No notes yet. Create your first note!</p>
      ) : (
        <div className="notes-container">
          {Object.values(notes)
            // Sort by lastUpdated (most recent first)
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((note) => (
              <NoteItem key={note.id} note={note} onEdit={onEditNote} />
            ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
