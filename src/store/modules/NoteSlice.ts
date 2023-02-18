import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { listNotes } from '../../api';
import { NoteSliceType } from '../../types';

const adapter = createEntityAdapter<NoteSliceType>({
  selectId: item => item.id
});

export const { selectAll: selectNotes, selectById } = adapter.getSelectors((state: RootState) => state.NoteSlice);

export const listAllNotes = createAsyncThunk('notes/getAll', async (userid: string) => {
  const result = await listNotes(userid);

  if (result) {
    return result.notes;
  }

  return [];
});

export const createNote = createAsyncThunk('notes/create', async (transaction: any) => {
  const result = await createNote({ ...transaction });

  console.log(result);

  // if (result.ok) {
  //   return {
  //     ok: true,
  //     data: result.data.transactions
  //   };
  // }

  // return {
  //   ok: false
  // };
});

const NoteSlice = createSlice({
  name: 'NoteSlice',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(listAllNotes.fulfilled, (state, action: PayloadAction<any>) => {
        adapter.setAll(state, action.payload);
      })
      .addCase(createNote.fulfilled, (state, action: PayloadAction<any>) => {
        adapter.addOne(state, action.payload);
      })
      .addCase(listAllNotes.rejected, (_, action) => {
        console.log(action.payload);
      });
  }
});

export default NoteSlice.reducer;
