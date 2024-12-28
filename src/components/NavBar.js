import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Link,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MusicNote as MusicNoteIcon,
  Search as SearchIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  AccountCircle,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
  width: 'auto',
  flexGrow: 1,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(6),
    width: '50%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1.2, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const NavBar = ({ toggleColorMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isAuthenticated = auth.currentUser !== null;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navLinks = [
    { title: 'Library', path: '/' },
    ...(isAuthenticated ? [{ title: 'Upload', path: '/upload' }] : []),
  ];

  const authLinks = !isAuthenticated
    ? [
        { title: 'Sign Up', path: '/signup' },
        { title: 'Login', path: '/login' },
      ]
    : [];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          color: '#fff',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          transition: 'background 0.3s ease-in-out',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
            component={RouterLink}
            to="/"
          >
            <MusicNoteIcon sx={{ mr: 1, fontSize: '2rem' }} />
            <Typography variant="h6" noWrap component="div">
              GanayShanay
            </Typography>
          </Box>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  component={RouterLink}
                  to={link.path}
                  color="inherit"
                  underline="none"
                  sx={{
                    mx: 1.5,
                    fontSize: '1rem',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: -2,
                      left: 0,
                      backgroundColor: '#fff',
                      transition: 'width 0.3s',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                  }}
                >
                  {link.title}
                </Link>
              ))}

              {!isAuthenticated ? (
                authLinks.map((link) => (
                  <Button
                    key={link.title}
                    component={RouterLink}
                    to={link.path}
                    color="inherit"
                    sx={{
                      ml: 2,
                      borderRadius: '20px',
                      paddingX: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      transition: 'background 0.3s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      },
                    }}
                  >
                    {link.title}
                  </Button>
                ))
              ) : (
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{ ml: 2 }}
                  aria-controls={openUserMenu ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openUserMenu ? 'true' : undefined}
                >
                  <Avatar
                    alt={auth.currentUser.displayName || 'User'}
                    src={auth.currentUser.photoURL || ''}
                  >
                    {auth.currentUser.displayName
                      ? auth.currentUser.displayName.charAt(0)
                      : <AccountCircle />}
                  </Avatar>
                </IconButton>
              )}

              <Menu
                anchorEl={anchorEl}
                open={openUserMenu}
                onClose={handleUserMenuClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1.5,
                    minWidth: 150,
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}

          <IconButton
            sx={{ ml: 1 }}
            onClick={toggleColorMode}
            color="inherit"
            aria-label="toggle theme"
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 250,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            py: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          }}
        >
          <Typography variant="h5" component="div">
            GanayShanay
          </Typography>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.title}
              component={RouterLink}
              to={link.path}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary={link.title} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {!isAuthenticated ? (
            authLinks.map((link) => (
              <ListItem
                button
                key={link.title}
                component={RouterLink}
                to={link.path}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={link.title} />
              </ListItem>
            ))
          ) : (
            <>
              <ListItem
                button
                component={RouterLink}
                to="/profile"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      <Toolbar />
    </Box>
  );

};

export default NavBar;
