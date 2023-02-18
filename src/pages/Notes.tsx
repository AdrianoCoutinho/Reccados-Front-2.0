import { Button, Card, CardActions, CardContent, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBarHeader, DialogAction, Snackbars } from '../components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { listAllNotes, selectNotes } from '../store/modules/NoteSlice';
import { setMessage } from '../store/modules/SnackBarsSlice';
import { NoteType } from '../types';
import { createNote } from '../api';

const Notes: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const noteData = useAppSelector(selectNotes);

  const loggedUser = () => {
    return localStorage.getItem('ReccadosLoggedUser') || sessionStorage.getItem('ReccadosLoggedUser') || '';
  };

  const getListNotes = async () => {
    dispatch(listAllNotes(loggedUser()));
  };

  useEffect(() => {
    getListNotes();
  }, []);

  const [note, setNote] = useState<NoteType>({
    detail: '',
    description: ''
  });

  const HandleLogout = () => {
    localStorage.removeItem('ReccadosLoggedUser');
    sessionStorage.removeItem('ReccadosLoggedUser');
    navigate('/');
  };

  const HandleAddNote = async () => {
    if (note.detail === '' || note.description === '') {
      return dispatch(setMessage({ message: 'Digite algo nos campos!', status: 'error' }));
    }
    if (note.detail.length < 5) {
      return dispatch(setMessage({ message: 'Digite ao menos 5 caracteres nos detalhes!', status: 'error' }));
    }
    if (note.description.length < 20) {
      return dispatch(setMessage({ message: 'Digite ao menos 20 caracteres na descrição!', status: 'error' }));
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
      detail: note.detail,
      description: note.description
    };

    const result = await createNote(loggedUser(), newNote);

    if (result.ok) {
      getListNotes();
      HandleClearNotes();
      dispatch(setMessage({ message: 'Recado adicionado com sucesso!', status: 'success' }));
      return;
    }
    dispatch(setMessage({ message: result.message.toString(), status: 'error' }));
  };

  const HandleClearNotes = () => {
    setNote({
      detail: '',
      description: ''
    });
  };

  const handleEditConfirm = () => {
    dispatch(setMessage({ message: 'Recado editado com sucesso!', status: 'success' }));
  };

  const handleDeleteConfirm = () => {
    dispatch(setMessage({ message: 'Recado deletado com sucesso!', status: 'success' }));
  };

  return (
    <React.Fragment>
      <AppBarHeader titleHeader={'Reccados'} actionLogout={HandleLogout} logedUser={loggedUser()} noteLength={22} />
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
          <Grid item xs={6} sx={{ mb: '20px' }}>
            <Button fullWidth variant="contained" onClick={HandleClearNotes}>
              LIMPAR
            </Button>
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
                    <DialogAction actionEdit={handleEditConfirm} actionDelete={handleDeleteConfirm} Note={item} />
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
