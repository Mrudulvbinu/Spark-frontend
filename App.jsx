import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Auth Pages
import Login from './Login.jsx';
import Regist from './register.jsx';

// Student Pages
import Shome from './studentpages/Shome.jsx';
import Tregpg from './studentpages/Tregpg.jsx';
import Vregpg from './studentpages/Vregpg.jsx';
import TeamHackathonDetails from './studentpages/TeamHackathonDetails';
import VirtualHackathonDetails from './studentpages/VirtualHackathonDetails';

// Organizer Pages
import Ohome from './organizerpages/Ohome.jsx';
import Hosthk from './organizerpages/hosthk.jsx';
import Revappro from './organizerpages/revappro.jsx';
import Approreg from './organizerpages/approreg.jsx';
import RegStud from './organizerpages/regstud.jsx';

// Admin Pages
import Ahome from './adminpages/Ahome.jsx';
import Adminevents from './adminpages/Adminevents.jsx';

// Other Pages
import About from './about.jsx';
import NotFound from '/components/NotFound'; 

// Create Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Rose color
    },
    secondary: {
      main: '#ff9800', // Orange color
    },
    background: {
      default: '#f5f5f5', // Light gray background
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none', // Buttons won't be all uppercase
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS and apply background color */}
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Regist />} />

          {/* General Routes */}
          <Route path="/about" element={<About />} />

          {/* Student Routes */}
          <Route path="/shome" element={<Shome />} />
          <Route path="/Tregpg/:hackathonId" element={<Tregpg />} />
          <Route path="/Vregpg/:hackathonId" element={<Vregpg />} /> 
          <Route path="/team-hackathon/:hackathonId" element={<TeamHackathonDetails />} />
          <Route path="/virtual-hackathon/:hackathonId" element={<VirtualHackathonDetails />} />

          {/* Organizer Routes */}
          <Route path="/ohome" element={<Ohome />} />
          <Route path="/hosthk" element={<Hosthk />} />
          <Route path="/revappro" element={<Revappro />} />
          <Route path="/approreg" element={<Approreg />} />
          <Route path="/regstud/:hackathonId" element={<RegStud />} />

          {/* Admin Routes */}
          <Route path="/ahome" element={<Ahome />} />
          <Route path="/event-details/:eventId" element={<Adminevents />} />

          {/* Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;