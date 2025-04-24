import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '/axiosinstance';
import { Container, Typography, Grid, Paper, Button, Chip, Divider, Box, IconButton, Stack, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import banner1 from '/assets/banner1.png';
import banner2 from '/assets/banner2.png';
import logo1 from '/assets/sparkventure.svg';

export default function TeamHackathonDetails() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const urlRegistered = searchParams.get('registered') === 'true';

   const bannerImages = [banner1, banner2];
    const partnerLogos = [logo1];

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
    if (urlRegistered) {
      setIsRegistered(true);
    } else {
      checkRegistration();
    }
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
    <Container maxWidth="lg" sx={{ py: 1 }}>
      {/* Compact Header Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4
      }}>
         {/* Back Button */}
         <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            alignSelf: 'flex-start',
            mb: 2
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Small Banner Images - side by side */}
<Box sx={{ 
  display: 'flex',
  justifyContent: 'center',
  gap: 2,
  mb: 2,
  width: '90%',
  maxHeight: '110px',
  overflow: 'hidden'
}}>
  {bannerImages.map((img, index) => (
    <Box 
      key={index}
      component="img"
      src={img}
      alt={`Banner ${index + 1}`}
      sx={{
        height: index === 0 ? '80px' : '40px', 
        width: 'auto',
        objectFit: 'contain',
        mt: index === 1 ? 4 : 0
      }}
    />
  ))}
</Box>

        <Avatar
          src={logo1}
          alt="SparkVenture Logo"
          variant="rounded"
          sx={{ 
            width: 600, 
            height: 100,
            objectFit: 'contain',
            mb: 1
          }}
        />

       
      </Box>
        
         {/* Event Title */}
      <Typography variant="h3" component="h1" gutterBottom align="center">
        {event.ename}
      </Typography>
      
      {/* Hackathon Type Chip */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Chip 
  label="Team Hackathon" 
  sx={{ 
    background: 'linear-gradient(to right, #FB923C, #E11D48)',
    color: 'white',
    fontWeight: 'bold',
  }}
  icon={<PeopleIcon style={{ color: 'white' }} />}
  />
      </Box>

      {/* Hackathon Details Card*/}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Event Details</Typography>
            <Divider sx={{ mb: 2 }}/>
            
            <Stack spacing={2}>
              <Typography><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</Typography>
              <Typography><strong>Venue:</strong> {event.venue}</Typography>
              <Typography><strong>Duration:</strong> {event.durofhk}</Typography>
              <Typography><strong>Prize Pool:</strong> {event.prize}</Typography>
              <Typography><strong>Team Size:</strong> Up to {event.maxTeamMembers} members</Typography>
              <Typography><strong>Registration Deadline:</strong> {new Date(event.regend).toLocaleDateString()}</Typography>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Divider sx={{ mb: 2 }}/>
            <Typography paragraph>{event.details}</Typography>
          </Grid>
        </Grid>
      </Paper>


 {/* Additional Information */}
 <Box sx={{ justifyContent: 'center',mb: 4 }}
      >
    <h3 className="text-3xl font-bold text-rose-600 mt-2 animate-bounce	">Powering Infinite Potential</h3>
    <Divider sx={{ mb: 3 }}/>
        <Typography paragraph>
        <p><span className="font-bold text-rose-600">‘Sparkventure 2.0</span> - Powering Infinite Potential’ is a student project/start-up funding initiative
instituted by <span className="font-bold text-rose-600">Core Cognitics Limited</span> and <span className="font-bold text-rose-600">Cognitry</span> conducted in association with the Department of
Computer Science and Engineering, IIC and IEEE Computer Society Chapter,<span className="font-bold text-rose-600">Toc H Institute of
Science and Technology</span>, Arakkunnam.</p>
We welcome  <span className="font-bold text-rose-600">project proposals from Engineering & Computer Science students showcasing unique
projects or startup ideas.</span> Exceptional proposals will stand a chance to receive grants to transform
their ideas into products. The challenge will run as a 6-month contest cycle.
        </Typography>
        <Typography paragraph>
<p>< h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-400
    bg-clip-text text-transparent">Objectives :</h1>
Empowering creative student projects through financial grants to evolve them into tangible products,
thereby cultivating a dynamic and lively environment that stimulates and nurtures a thriving startup
ecosystem within the country. The initiative specifically focuses on startup ideas, aiming to ignite
innovation among students and serve as a catalyst for their entrepreneurial endeavours.</p>
        </Typography>

        <Typography paragraph>
        <p>< h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-400
    bg-clip-text text-transparent">Domain:</h1>Empowering creative student projects through financial grants to evolve them into tangible products,
thereby cultivating a dynamic and lively environment that stimulates and nurtures a thriving startup
ecosystem within the country. The initiative specifically focuses on startup ideas, aiming to ignite
innovation among students and serve as a catalyst for their entrepreneurial endeavours.</p>
        </Typography>
      </Box>


      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
  {isRegistered ? (
    <Button 
      variant="contained" 
      size="large"
      disabled
      sx={{
        backgroundColor: '#4caf50', px: 4
      }}
    >
      Already Registered
    </Button>
  ) : (
    <Button 
    variant="contained" 
    size="large"
    onClick={() => navigate(`/Tregpg/${event._id}`)}
    sx={{ 
      px: 4, background: 'linear-gradient(to right, #FB923C, #E11D48)', color: 'white', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': { transform: 'scale(1.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', }
    }}>
    Register Now
  </Button>
  )}
  
  <Button 
  variant="outlined" 
  size="large"
  onClick={() => navigate('/shome')}
  sx={{ 
    px: 4,
    color: '#E11D48',borderColor: '#E11D48',fontWeight: 600,'&:hover': { backgroundColor: 'rgba(225, 29, 72, 0.1)', borderColor: '#E11D48',
    color: '#E11D48',transform: 'scale(1.05)',transition: 'all 0.2s ease'}
  }}>
  Back to Events
</Button>
</Box>
    </Container>
  );
}