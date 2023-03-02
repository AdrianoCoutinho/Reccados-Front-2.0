import { TextField, Button, Checkbox, Grid, Typography, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUserType } from '../types';
import { useAppDispatch } from '../store/hooks';
import { useLocation } from 'react-router-dom';
import { Link, Snackbars } from '../components';
import { setMessage } from '../store/modules/SnackBarsSlice';
import { createUser, login } from '../api';

const LoginRegister: React.FC = () => {
  const navigate = useNavigate();
  const pathName = useLocation().pathname;
  const dispatch = useAppDispatch();
  const [logged, setLogged] = useState<boolean>(false);
  const [user, setUser] = useState<RegisterUserType>({
    name: '',
    email: '',
    password: '',
    repassword: '',
    notes: []
  });

  const loggedUser = () => {
    return localStorage.getItem('ReccadosLoggedUser') || sessionStorage.getItem('ReccadosLoggedUser') || undefined;
  };

  useEffect(() => {
    if (loggedUser()) {
      return navigate('/notes');
    }
  }, []);

  const ValidatContact = () => {
    pathName != '/' ? handleRegisterContact() : handleLoginContact();
  };

  const handleRegisterContact = async () => {
    if (user.name === '' || user.email === '' || user.password === '' || user.repassword === '') {
      return dispatch(setMessage({ message: 'Preencha todos os campos!', status: 'error' }));
    }
    if (user.password != user.repassword) {
      return dispatch(setMessage({ message: 'As senhas não coincidem!', status: 'error' }));
    }

    if (user.name.length < 5) {
      return dispatch(
        setMessage({ message: 'Utilize um nome de usuário com no mínimo 5 caracteres!', status: 'error' })
      );
    }
    if (user.password.length < 6) {
      return dispatch(setMessage({ message: 'Utilize uma senha com no mínimo 6 caracteres!', status: 'error' }));
    }

    const newUser: RegisterUserType = {
      name: user.name,
      email: user.email.toLowerCase(),
      password: user.password,
      repassword: user.repassword,
      notes: user.notes
    };

    const result = await createUser(newUser);

    if (result.ok) {
      dispatch(setMessage({ message: 'Registrado com sucesso!', status: 'success' }));
      navigate('/');
      return;
    }
    dispatch(setMessage({ message: result.message.toString(), status: 'error' }));
  };

  const handleLoginContact = async () => {
    const LoginUser = {
      email: user.email.toLowerCase(),
      password: user.password
    };

    const result = await login(LoginUser);

    if (result.ok) {
      dispatch(setMessage({ message: 'Logado com sucesso!', status: 'success' }));
      sessionStorage.setItem('ReccadosLoggedUser', result.data.id);
      sessionStorage.setItem('ReccadosLoggedName', result.data.name);
      if (logged) {
        localStorage.setItem('ReccadosLoggedUser', result.data.id);
        sessionStorage.setItem('ReccadosLoggedName', result.data.name);
      }
      return navigate('/notes');
    }
    dispatch(setMessage({ message: result.message.toString(), status: 'error' }));
  };

  const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogged(event.target.checked);
  };

  return (
    <React.Fragment>
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <Snackbars />
        <Grid
          spacing={2}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            maxWidth: '500px',
            backgroundColor: '#ffffff',
            paddingBottom: '100px',
            borderRadius: '10px',
            marginLeft: '0 !important'
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              backgroundImage: 'url(/images/img-header-login.jpeg)',
              backgroundSize: 'cover'
            }}
          >
            <Typography variant="h3" gutterBottom sx={{ padding: '30px', color: 'white' }}>
              {pathName == '/' ? 'LOGIN' : 'REGISTRO'}
            </Typography>
          </Grid>
          {pathName === '/register' && (
            <Grid item xs={12} sx={{ mt: '50px' }}>
              <TextField
                label="Nome"
                value={user.name}
                onChange={ev =>
                  setUser({
                    name: ev.target.value,
                    email: user.email,
                    password: user.password,
                    repassword: user.password,
                    notes: user.notes
                  })
                }
                variant="outlined"
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={user.email}
              onChange={ev =>
                setUser({
                  name: user.name,
                  email: ev.target.value,
                  password: user.password,
                  repassword: user.password,
                  notes: user.notes
                })
              }
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Senha"
              value={user.password}
              onChange={ev =>
                setUser({
                  name: user.name,
                  email: user.email,
                  password: ev.target.value,
                  repassword: user.repassword,
                  notes: user.notes
                })
              }
              variant="outlined"
              type="password"
            />
          </Grid>
          {pathName === '/register' && (
            <Grid item xs={12}>
              <TextField
                label="Repita a senha"
                type="password"
                value={user.repassword}
                onChange={ev =>
                  setUser({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    notes: user.notes,
                    repassword: ev.target.value
                  })
                }
                variant="outlined"
              />
            </Grid>
          )}

          {pathName === '/' && (
            <Grid item xs={12} sx={{ mt: '-20px', mb: '-10px' }}>
              <Checkbox checked={logged} onChange={handleChangeCheckBox} />
              Manter login?
            </Grid>
          )}

          <Grid item xs={12}>
            <Button variant="contained" onClick={ValidatContact}>
              {pathName == '/' ? 'Entrar' : 'Registrar'}
            </Button>
          </Grid>
          <Grid item xs={12}>
            {pathName == '/' ? (
              <>
                Não tem conta? <Link to="/register" name="Registrar-se" />
              </>
            ) : (
              <>
                Já tem uma conta? <Link to="/" name="Fazer login" />
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default LoginRegister;
