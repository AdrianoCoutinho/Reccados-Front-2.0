import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listNotes, listUser } from '../api';
import { AppBarHeader, DialogAction, Snackbars } from '../components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNote, listAllNotes, removeNote, removeOneNote, selectNotes, updateNote } from '../store/modules/NoteSlice';
import { setMessage } from '../store/modules/SnackBarsSlice';
import {
  ListParamsType,
  NoteDeleteActionType,
  NoteDeleteType,
  NoteEditActionType,
  NoteEditType,
  NoteSliceType,
  NoteType
} from '../types';

const Notes: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const noteData = useAppSelector(selectNotes);
  const [search, setSearch] = useState({ detail: '', arquived: false });
  const [notesTotalCount, setNotesTotalCount] = useState(0);
  const [notesArquivedCount, setNotesArquivedCount] = useState(0);
  const [note, setNote] = useState<NoteType>({
    detail: '',
    description: ''
  });

  useEffect(() => {
    if (loggedUser() === '') {
      return navigate('/');
    }
    veirfyUser();
  }, [dispatch]);

  useEffect(() => {
    notesLengthArquived();
    notesLengthTotal();
  }, [noteData]);

  useEffect(() => {
    listFilters();
  }, [search]);

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

  const notesLengthTotal = async () => {
    const listParams = {
      userid: loggedUser(),
      note: {
        detail: '',
        arquived: true
      }
    };
    const result = await listNotes(listParams);
    if (result.ok) {
      return setNotesTotalCount(result.notes.length);
    }
  };

  const notesLengthArquived = async () => {
    const listParams = {
      userid: loggedUser()
    };
    const result = await listNotes(listParams);
    if (result.ok) {
      return setNotesArquivedCount(result.notes.length);
    }
  };

  const listFilters = () => {
    const listParams: ListParamsType = {
      userid: loggedUser(),
      note: {
        detail: search.detail,
        arquived: search.arquived
      }
    };
    dispatch(listAllNotes(listParams));
  };

  const HandleLogout = () => {
    localStorage.removeItem('ReccadosLoggedUser');
    sessionStorage.removeItem('ReccadosLoggedUser');
    navigate('/');
  };

  const HandleAddNote = async () => {
    if (note.detail === '' || note.description === '') {
      return dispatch(setMessage({ message: 'Digite algo nos campos!', status: 'error' }));
    }

    if (note.detail.length > 20) {
      return dispatch(
        setMessage({ message: 'Você ultrapassou o limite de 20 caracteres nos detalhes!', status: 'error' })
      );
    }
    if (note.description.length > 494) {
      return dispatch(
        setMessage({ message: 'Você ultrapassou o limite de 494 caracteres na descrição!', status: 'error' })
      );
    }
    const newNote: NoteType = {
      userid: loggedUser(),
      detail: note.detail,
      description: note.description
    };

    dispatch(addNote(newNote));
    HandleClearNotes();
  };

  const HandleClearNotes = () => {
    setNote({
      detail: '',
      description: ''
    });
  };

  const handleEditConfirm = async (noteToEdit: NoteEditActionType) => {
    const dispatchEdit: NoteEditType = {
      userid: loggedUser(),
      id: noteToEdit.id,
      detail: noteToEdit.detail,
      description: noteToEdit.description,
      arquived: noteToEdit.arquived
    };
    const result = await dispatch(updateNote(dispatchEdit)).unwrap();
    if (result.ok) {
      return dispatch(setMessage({ message: 'Recado editado com sucesso!', status: 'success' }));
    }
    dispatch(setMessage({ message: 'Recado não foi editado.', status: 'error' }));
  };

  const veriFyFile = (file: NoteSliceType) => {
    if (!file.arquived) {
      return handleToFileConfirm(file);
    }
    return handleToUnFileConfirm(file);
  };

  const handleToFileConfirm = async (noteToEdit: NoteEditActionType) => {
    const dispatchEdit: NoteEditType = {
      userid: loggedUser(),
      id: noteToEdit.id,
      detail: noteToEdit.detail,
      description: noteToEdit.description,
      arquived: true
    };
    const result = await dispatch(updateNote(dispatchEdit)).unwrap();
    if (!result.ok) {
      dispatch(setMessage({ message: 'Recado não foi arquivado!', status: 'error' }));
      return;
    }
    if (!search.arquived) {
      dispatch(removeOneNote(noteToEdit.id));
    }
    dispatch(setMessage({ message: 'Recado arquivado com sucesso!', status: 'success' }));
  };

  const handleToUnFileConfirm = async (noteToEdit: NoteEditActionType) => {
    const dispatchEdit: NoteEditType = {
      userid: loggedUser(),
      id: noteToEdit.id,
      detail: noteToEdit.detail,
      description: noteToEdit.description,
      arquived: false
    };
    const result = await dispatch(updateNote(dispatchEdit)).unwrap();
    if (!result.ok) {
      dispatch(setMessage({ message: 'Recado não foi arquivado!', status: 'error' }));
      return;
    }
    if (!search.arquived) {
      dispatch(removeOneNote(noteToEdit.id));
    }
    dispatch(setMessage({ message: 'Recado arquivado com sucesso!', status: 'success' }));
  };

  const handleDeleteConfirm = (noteToDelete: NoteDeleteActionType) => {
    const dispatchDelete: NoteDeleteType = {
      id: noteToDelete.id,
      userid: loggedUser()
    };
    dispatch(removeNote(dispatchDelete));
  };

  const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ detail: search.detail, arquived: event.target.checked });
  };

  return (
    <React.Fragment>
      <AppBarHeader
        titleHeader={'Reccados'}
        actionLogout={HandleLogout}
        logedUser={loggedUserName()}
        noteArquivedLength={notesArquivedCount}
        noteLength={notesTotalCount}
      />
      <Container maxWidth={false} sx={{ backgroundColor: '#ebeeef', height: 'auto', paddingBottom: '10px' }}>
        <Grid container rowSpacing={1} columnSpacing={2}>
          <Snackbars />
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label="Detalhes"
              inputProps={{ maxLength: 20 }}
              value={note.detail}
              onChange={ev => {
                setNote({
                  detail: ev.target.value,
                  description: note.description
                });
              }}
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Descrição"
              inputProps={{ maxLength: 494 }}
              value={note.description}
              onChange={ev => {
                setNote({
                  detail: note.detail,
                  description: ev.target.value
                });
              }}
              variant="filled"
            />
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" color="success" onClick={HandleAddNote}>
              SALVAR
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" onClick={HandleClearNotes}>
              LIMPAR
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ textAling: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                maxWidth: '100%'
              }}
            >
              <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                variant="standard"
                fullWidth
                label="Buscar.."
                onChange={ev => setSearch({ detail: ev.target.value, arquived: search.arquived })}
                id="fullWidth"
              />
              <FormControlLabel
                control={<Checkbox checked={search.arquived} onChange={handleChangeCheckBox} color="secondary" />}
                label="Arquivados"
                color="secondary"
                title="exibir recados arquivados"
              />
            </Box>
          </Grid>

          {noteData

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
                    <DialogAction
                      actionEdit={handleEditConfirm}
                      actionToFile={() => veriFyFile(item)}
                      actionDelete={handleDeleteConfirm}
                      Note={item}
                    />
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Notes;
