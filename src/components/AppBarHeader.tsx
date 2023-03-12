import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { AccountCircle } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { AppBarHeaderProps } from '../types';
import { Inventory } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AppBarHeader: React.FC<AppBarHeaderProps> = ({
  titleHeader,
  actionLogout,
  logedUser,
  noteLength,
  noteArquivedLength
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
            {titleHeader}
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
          <Typography variant="body1">
            <Badge
              sx={{ marginRight: '22px', cursor: 'pointer' }}
              badgeContent={noteArquivedLength}
              color="warning"
              title="total de recados arquivados"
            >
              <MailIcon color="action" />
            </Badge>
            <Badge sx={{ cursor: 'pointer' }} badgeContent={noteLength} color="secondary" title="total de recados">
              <MailIcon color="action" />
            </Badge>

            <IconButton
              sx={{ marginLeft: '15px' }}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>{logedUser.toUpperCase()}</MenuItem>
              <MenuItem onClick={actionLogout}>Sair</MenuItem>
            </Menu>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppBarHeader;
