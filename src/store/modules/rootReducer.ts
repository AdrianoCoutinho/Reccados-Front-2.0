import { combineReducers } from '@reduxjs/toolkit';

import NoteSlice from './NoteSlice';
import SnackBarsSlice from './SnackBarsSlice';

export default combineReducers({
  NoteSlice,
  SnackBarsSlice
});
