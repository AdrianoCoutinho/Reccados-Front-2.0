import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { UserType } from '../../types';

const adapter = createEntityAdapter<UserType>({
  selectId: item => item.name
});

export const { selectAll, selectById } = adapter.getSelectors((state: RootState) => state.UserSlice);

const UserSlice = createSlice({
  name: 'UserSlice',
  initialState: adapter.getInitialState(),
  reducers: {
    addOneUser: adapter.addOne,
    addManyUser: adapter.addMany,
    updateOneUSer: adapter.updateOne
  }
});

export const { addOneUser, addManyUser, updateOneUSer } = UserSlice.actions;
export default UserSlice.reducer;
