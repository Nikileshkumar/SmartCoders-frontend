import React from 'react';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  InputBase,
  Link,
  Container,
  Paper,
  IconButton,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import AssuredWorkloadRoundedIcon from '@mui/icons-material/AssuredWorkloadRounded';
import { styled, alpha } from '@mui/material/styles';
import { BrowserRouter as Router, Link as RouterLink, Routes, Route } from "react-router-dom";
import Register from './Pages/Register';
import StartApplication from './Pages/StartApplication';
import './App.css';
import ResumeApplication from './Pages/ResumeApplication';


// Styled component for the search bar, mimicking the image's style
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#101111ff', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between', textAlign: 'center' }}>
          <Box sx={{ width: 800, mt: 1, mb: 1 }}>
            <Link color="inherit" underline="none" sx={{ mr: 2 }}>Personal</Link>
            <Link color="inherit" underline="none" sx={{ mr: 2 }}>Business</Link>
            <Link color="inherit" underline="none" sx={{ mr: 2 }}>Private Banking</Link>
            <Link color="inherit" underline="none">International Banking</Link>
          </Box>
        </Toolbar>
      </AppBar>

      <AppBar position="static" sx={{ backgroundColor: '#16915bff', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between', textAlign: 'center' }}>
          <Box component="img" src="logo-lloyds.svg" alt="Lloyds Bank logo" sx={{ height: 50, mr: 1, ml: 22 }} />
          <Box sx={{ width: 1000, mr: 2 }}>
            <IconButton size="small" sx={{ color: 'black', fontWeight: 'bold', mr: 2 }} component={RouterLink} to="#" > <LockRoundedIcon /> Log on |</IconButton>
            <Button size="small" sx={{ color: 'black', fontWeight: 'bold', mr: 2 }}
              component={RouterLink}
              to="/get-started"
            > <AssuredWorkloadRoundedIcon /> Open a new account</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/setup-account" element={<Register />} />
      <Route path="/get-started" element={<StartApplication />} />
      <Route path="/resumeJourney" element={<ResumeApplication />} />
    </Routes>
  );
}


function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Lloyds Bank
        </Typography>
        <Typography variant="body1">
          Looking for a new account? We have a range of options to suit your needs.
        </Typography>
      </Paper>
    </Container>
  );
}



function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Header />
        <AppRoutes />
      </PersistGate>
    </Provider>
  );
}

export default App;
