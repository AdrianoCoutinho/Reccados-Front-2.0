/* eslint-disable no-unused-vars */
import SelectedNoteType from './SelectedNoteType';
import { NoteDeleteActionType, NoteEditActionType } from '../types';
interface NoteProps {
  Note: SelectedNoteType;
  actionEdit: (Note: NoteEditActionType) => void;
  actionToFile: (Note: NoteEditActionType) => void;
  actionDelete: (Note: NoteDeleteActionType) => void;
}

export default NoteProps;
