/* eslint-disable no-unused-vars */
import NoteActionsType from './NoteActionsType';
import NoteDeleteActionType from './NoteDeleteActionType';
interface NoteProps {
  Note: NoteActionsType;
  actionEdit: (Note: any) => void;
  actionToFile: (Note: any) => void;
  actionDelete: (Note: NoteDeleteActionType) => void;
}

export default NoteProps;
