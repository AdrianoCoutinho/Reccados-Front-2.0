import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { createNote, deleteNote, editNote, listNotes } from '../../api';
import { NoteEditType, NoteSliceType, NoteType } from '../../types';
import NoteDeleteType from '../../types/NoteDeleteType';
import { setMessage } from './SnackBarsSlice';

const notesadapter = createEntityAdapter<NoteSliceType>({
  selectId: item => item.id
});

export const { selectAll: selectNotes, selectById } = notesadapter.getSelectors((state: RootState) => state.NoteSlice);

export const listAllNotes = createAsyncThunk('notes/listAll', async (userid: string) => {
  const result = await listNotes(userid);
  if (result.ok) {
    return result.notes;
  }

  return [];
});

export const addNote = createAsyncThunk('notes/create', async (note: NoteType, { dispatch }) => {
  const result = await createNote(note);
  if (result.ok) {
    dispatch(setMessage({ message: 'Recado adicionado com sucesso!', status: 'success' }));
    return result.data;
  }
  dispatch(setMessage({ message: 'Recado não foi adicionado', status: 'error' }));
  return { ok: false };
});

export const updateNote = createAsyncThunk('notes/edit', async (note: NoteEditType, { dispatch }) => {
  const result = await editNote(note);
  if (result.ok) {
    dispatch(setMessage({ message: 'Recado editado com sucesso!', status: 'success' }));
    return result.data;
  }
  dispatch(setMessage({ message: 'Recado não foi editado!', status: 'error' }));
  return { ok: false };
});

export const removeNote = createAsyncThunk('notes/delete', async (note: NoteDeleteType, { dispatch }) => {
  const result = await deleteNote(note);
  if (result.ok) {
    dispatch(setMessage({ message: 'Recado deletado com sucesso!', status: 'success' }));
    return result.note.id;
  }
  dispatch(setMessage({ message: 'Recado não foi deletado!', status: 'error' }));
  return { ok: false };
});

const NoteSlice = createSlice({
  name: 'NoteSlice',
  initialState: notesadapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(listAllNotes.fulfilled, notesadapter.setAll);
    builder.addCase(addNote.fulfilled, notesadapter.addOne);
    builder.addCase(updateNote.fulfilled, notesadapter.setOne);
    builder.addCase(removeNote.fulfilled, notesadapter.removeOne);
  }
});

export default NoteSlice.reducer;
