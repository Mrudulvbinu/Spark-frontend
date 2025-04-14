import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '/axiosinstance';
import { 
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  Box,
  IconButton,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ComputerIcon from '@mui/icons-material/Computer';

export default function VirtualHackathonDetails() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchEvent = async () => {
    try {
      const res = await axiosInstance.get('/hackathons');
      const foundEvent = res.data.find(h => h._id === hackathonId);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        setEvent(null);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const studentId = localStorage.getItem('studentId');
      const token = localStorage.getItem('token');
      
      if (!studentId || !token) {
        console.log('No studentId or token available');
        return;
      }

      const res = await axiosInstance.get(
        `/registeredhackathon/check/${hackathonId}`
      ).catch(error => {
        if (error.response?.status === 401) {
          console.log('Not registered (401 response)');
          return { data: { isRegistered: false } };
        }
        throw error;
      });
      
      setIsRegistered(res.data.isRegistered);
    } catch (error) {
      console.error('Registration check failed:', error);
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem('studentId');
    
    if (!token || !studentId) {
      console.log('Missing authentication data');
      return;
    }

    fetchEvent();
    checkRegistration();
  }, [hackathonId]);

  if (loading) return <div>Loading...</div>;
  if (!event) return (
    <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h6" color="error">Event not found</Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate(-1)}
        sx={{ mt: 2 }}
      >
        Back to Events
      </Button>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={4}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        
        <Typography variant="h3" component="h1" gutterBottom>
          {event.ename}
        </Typography>
        
        <Chip 
          label="Virtual Hackathon" 
          sx={{ 
            mb: 2,
            background: 'linear-gradient(to right, #FB923C, #E11D48)',
            color: 'white',
            fontWeight: 'bold',
          }}
          icon={<ComputerIcon style={{ color: 'white' }} />}
        />
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Event Details</Typography>
            <Divider sx={{ mb: 2 }}/>
            
            <Stack spacing={2}>
              <Typography><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</Typography>
              <Typography><strong>Platform:</strong> {event.venue || "To be announced"}</Typography>
              <Typography><strong>Duration:</strong> {event.durofhk}</Typography>
              <Typography><strong>Prize Pool:</strong> {event.prize}</Typography>
              <Typography><strong>Registration Deadline:</strong> {new Date(event.regend).toLocaleDateString()}</Typography>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Challenge Details</Typography>
            <Divider sx={{ mb: 2 }}/>
            <Typography paragraph>{event.details || "Detailed information about the virtual hackathon challenges will be provided soon."}</Typography>
            
            {event.requirements && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Technical Requirements</Typography>
                <Typography paragraph>{event.requirements}</Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {isRegistered ? (
          <Button 
            variant="contained" 
            size="large"
            disabled
            sx={{
              backgroundColor: '#4caf50',
              px: 4
            }}
          >
            Already Registered
          </Button>
        ) : (
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate(`/Vregpg/${event._id}`)}
            sx={{ 
              px: 4,
              background: 'linear-gradient(to right, #FB923C, #E11D48)',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                background: 'linear-gradient(to right, #FB923C, #E11D48)'
              }
            }}
          >
            Register Now
          </Button>
        )}
        
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate('/shome')}
          sx={{ 
            px: 4,
            color: '#E11D48',
            borderColor: '#E11D48',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(225, 29, 72, 0.1)',
              borderColor: '#E11D48',
              color: '#E11D48',
              transform: 'scale(1.05)',
              transition: 'all 0.2s ease'
            }
          }}
        >
          Back to Events
        </Button>
      </Box>
    </Container>
  );
}