import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import NoteProps from '../types/NoteProps';
import { setMessage } from '../store/modules/SnackBarsSlice';
import { useAppDispatch } from '../store/hooks';
import NoteActionsType from '../types/NoteActionsType';

const DialogAction: React.FC<NoteProps> = ({ Note, actionEdit, actionDelete }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [dialogDelete, setdialogDelete] = React.useState(false);
  const [selectedNote, setselectedNote] = React.useState<NoteActionsType>({
    id: Note.id,
    detail: Note.detail,
    description: Note.description
  });

  const handleClickOpenEdit = () => {
    setselectedNote({ id: Note.id, detail: Note.detail, description: selectedNote.description });
    setdialogDelete(false);
    setOpen(true);
  };

  const handleClickOpenDelete = () => {
    setdialogDelete(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    actionDelete(Note);
    setOpen(false);
  };

  const handleEdit = () => {
    if (selectedNote.detail === '' || selectedNote.description === '') {
      return dispatch(setMessage({ message: 'Digite algo nos campos!', status: 'error' }));
    }
    if (selectedNote.detail.length > 20) {
      return dispatch(
        setMessage({ message: 'Você ultrapassou o limite de 20 caracteres nos detalhes!', status: 'error' })
      );
    }
    if (selectedNote.description.length > 494) {
      return dispatch(
        setMessage({ message: 'Você ultrapassou o limite de 494 caracteres na descrição!', status: 'error' })
      );
    }
    actionEdit(selectedNote);
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={handleClickOpenEdit}>
        Editar
      </Button>
      <Button
        variant="outlined"
        color="error"
        endIcon={<DeleteIcon />}
        onClick={handleClickOpenDelete}
        sx={{ ml: '5px' }}
      >
        Excluir
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ID: {22}</DialogTitle>
        {!dialogDelete && (
          <>
            <DialogContent>
              <DialogContentText>{`Você esta editando o recado "${Note.detail}"`}</DialogContentText>
              <TextField
                autoFocus
                color="info"
                focused
                inputProps={{ maxLength: 20 }}
                margin="dense"
                value={selectedNote.detail}
                onChange={ev => {
                  setselectedNote({ id: Note.id, detail: ev.target.value, description: selectedNote.description });
                }}
                label="Detalhes"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                color="info"
                focused
                margin="dense"
                inputProps={{ maxLength: 494 }}
                value={selectedNote.description}
                onChange={ev => {
                  setselectedNote({ id: Note.id, detail: selectedNote.detail, description: ev.target.value });
                }}
                label="Descrição"
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button color="success" onClick={handleEdit}>
                Confirmar
              </Button>
            </DialogActions>
          </>
        )}

        {dialogDelete && (
          <>
            <DialogContent>
              <DialogContentText>{`Tem certeza que deseja excluir o recado "${Note.detail}"?`}</DialogContentText>
              <TextField
                disabled
                margin="dense"
                value={selectedNote.detail}
                onChange={ev => {
                  setselectedNote({ id: Note.id, detail: ev.target.value, description: selectedNote.description });
                }}
                label="Detalhes"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                disabled
                margin="dense"
                value={selectedNote.description}
                onChange={ev => {
                  setselectedNote({ id: Note.id, detail: selectedNote.detail, description: ev.target.value });
                }}
                label="Detalhes"
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleDelete}>Deletar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default DialogAction;
