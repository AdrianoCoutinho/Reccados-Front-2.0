import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { wakeup } from '../api';

////utilizado para "acordar" a api no render, retirar se for usar em produção
export default function WakeUpBackdrop() {
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    wakeUpRender();
  }, []);

  const wakeUpRender = async () => {
    const result = await wakeup();
    if (result.data.ok) {
      return handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
