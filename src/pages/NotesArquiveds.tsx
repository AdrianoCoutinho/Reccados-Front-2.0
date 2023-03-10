import PublishIcon from '@mui/icons-material/Publish';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listUser } from '../api';
import { AppBarHeader, Snackbars } from '../components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { listAllNotes, removeNote, selectNotes, updateNote } from '../store/modules/NoteSlice';
import { setMessage } from '../store/modules/SnackBarsSlice';
import { NoteEditType } from '../types';
import NoteDeleteType from '../types/NoteDeleteType';
import NoteActionsType from '../types/NoteActionsType';

const NotesArquiveds: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<boolean>(false);
  const [arquivedCount, setArquivedCount] = React.useState<number>(1);
  const [selectedNote, setselectedNote] = React.useState<NoteActionsType>({
    id: '',
    detail: '',
    description: ''
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const noteData = useAppSelector(selectNotes);

  const veirfyUser = async () => {
    const user = localStorage.getItem('ReccadosLoggedUser') || sessionStorage.getItem('ReccadosLoggedUser') || '';
    const result = await listUser(user);
    if (!result.ok) {
      localStorage.removeItem('ReccadosLoggedUser');
      sessionStorage.removeItem('ReccadosLoggedUser');
      return navigate('/');
    }
  };

  const loggedUser = () => {
    return localStorage.getItem('ReccadosLoggedUser') || sessionStorage.getItem('ReccadosLoggedUser') || '';
  };

  const loggedUserName = () => {
    return localStorage.getItem('ReccadosLoggedName') || sessionStorage.getItem('ReccadosLoggedName') || '';
  };

  useEffect(() => {
    if (loggedUser() === '') {
      return navigate('/');
    }
    veirfyUser();
    dispatch(listAllNotes(loggedUser()));
    arquivedLength();
  }, [dispatch]);

  const HandleLogout = () => {
    localStorage.removeItem('ReccadosLoggedUser');
    sessionStorage.removeItem('ReccadosLoggedUser');
    navigate('/');
  };

  const handleDeleteOpen = (item: NoteActionsType) => {
    setselectedNote(item);
    setToDelete(true);
    setOpen(true);
  };

  const handleUnFileOpen = (item: NoteActionsType) => {
    setselectedNote(item);
    setToDelete(false);
    setOpen(true);
  };

  const handleToFileConfirm = async () => {
    const dispatchEdit: NoteEditType = {
      userid: loggedUser(),
      id: selectedNote.id,
      detail: selectedNote.detail,
      description: selectedNote.description,
      arquived: false
    };
    handleClose();
    const result = await dispatch(updateNote(dispatchEdit)).unwrap();
    if (!result.ok) {
      dispatch(setMessage({ message: 'Recado não foi desarquivado!', status: 'error' }));
      return;
    }
    dispatch(setMessage({ message: 'Recado desarquivado com sucesso!', status: 'success' }));
  };

  const handleDeleteConfirm = () => {
    const dispatchDelete: NoteDeleteType = {
      id: selectedNote.id,
      userid: loggedUser()
    };
    dispatch(removeNote(dispatchDelete));
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const arquivedLength = () => {
    setArquivedCount(noteData.filter(item => item.arquived === true).length);
  };

  return (
    <React.Fragment>
      <AppBarHeader
        titleHeader={'Reccados'}
        actionLogout={HandleLogout}
        logedUser={loggedUserName()}
        noteArquivedLength={arquivedCount}
        noteLength={noteData.length}
      />
      <Container maxWidth={false} sx={{ backgroundColor: '#ebeeef', height: 'auto', paddingBottom: '10px' }}>
        <Grid container rowSpacing={1} columnSpacing={2}>
          <Snackbars />
          <Grid item xs={12}>
            <Typography variant="h4" color={'GrayText'} sx={{ textAlign: 'center' }}>
              RECADOS ARQUIVADOS
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ mb: '20px' }}>
            <Button fullWidth variant="contained" color="success" onClick={() => navigate('/notes')}>
              VOLTAR
            </Button>
          </Grid>
          {noteData
            .filter(note => note.arquived === true)
            .slice(0)
            .reverse()
            .map(item => (
              <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxHeight: 430 }}>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                      title={`Detalhes: ${item.detail}`}
                    >
                      {item.detail}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minHeight: '282.66px', wordWrap: 'break-word' }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <IconButton
                      title="desarquivar recado"
                      color="success"
                      aria-label="upload picture"
                      component="label"
                      onClick={() => handleUnFileOpen(item)}
                    >
                      <PublishIcon />
                    </IconButton>
                    <IconButton
                      title="excluir recado"
                      color="error"
                      aria-label="upload picture"
                      component="label"
                      onClick={() => handleDeleteOpen(item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ID: {selectedNote.id}</DialogTitle>

        {!toDelete && (
          <>
            <DialogContent>
              <DialogContentText>{'Tem certeza que deseja desarquivar este recado?'}</DialogContentText>
              <TextField
                disabled
                margin="dense"
                value={selectedNote.detail}
                label="Detalhes"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                disabled
                margin="dense"
                value={selectedNote.description}
                label="Detalhes"
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button color="success" onClick={handleToFileConfirm}>
                Desarquivar
              </Button>
            </DialogActions>
          </>
        )}
        {toDelete && (
          <>
            <DialogContent>
              <DialogContentText>{'Tem certeza que deseja excluir este recado?'}</DialogContentText>
              <TextField
                disabled
                margin="dense"
                value={selectedNote.detail}
                label="Detalhes"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                disabled
                margin="dense"
                value={selectedNote.description}
                label="Detalhes"
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button color="error" onClick={handleDeleteConfirm}>
                Excluir
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </React.Fragment>
  );
};

export default NotesArquiveds;
