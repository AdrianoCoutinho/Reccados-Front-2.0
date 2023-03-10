import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { createNote, deleteNote, editNote, listNotes } from '../../api';
import { NoteEditType, NoteSliceType, NoteType } from '../../types';
import NoteDeleteType from '../../types/NoteDeleteType';
import { setMessage } from './SnackBarsSlice';

const notesadapter = createEntityAdapter<NoteSliceType>({
  selectId: item => item.id
});

export const { selectAll: selectNotes, selectById } = notesadapter.getSelectors((state: RootState) => state.NoteSlice);

export const listAllNotes = createAsyncThunk('notes/listAll', async (params: any) => {
  const result = await listNotes(params);
  console.log(result);
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

export const updateNote = createAsyncThunk('notes/edit', async (note: NoteEditType) => {
  const result = await editNote(note);
  let changes = {};
  if (result.ok) {
    changes = {
      detail: note.detail,
      description: note.description,
      arquived: note.arquived
    };
  }
  return {
    id: note.id,
    changes,
    ok: result.ok
  };
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
  reducers: {
    removeOneNote: notesadapter.removeOne
  },
  extraReducers: builder => {
    builder.addCase(listAllNotes.fulfilled, notesadapter.setAll);
    builder.addCase(addNote.fulfilled, notesadapter.addOne);
    builder.addCase(updateNote.fulfilled, notesadapter.updateOne);
    builder.addCase(removeNote.fulfilled, notesadapter.removeOne);
  }
});

export const { removeOneNote } = NoteSlice.actions;
export default NoteSlice.reducer;
