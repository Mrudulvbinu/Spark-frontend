import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinstance";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Button,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DescriptionIcon from "@mui/icons-material/Description";


const Adminevents = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [registrations, setRegistrations] = useState([]);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState(null);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axiosInstance.get(`/hackathons/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  // Fetch registrations when tab changes
  useEffect(() => {
    if (activeTab === "registrations" && eventId) {
      const fetchRegistrations = async () => {
        setRegLoading(true);
        setRegError(null);
        try {
          const response = await axiosInstance.get(
            `/registeredhackathon/hackathon/${eventId}`
          );
          setRegistrations(response.data);
        } catch (err) {
          setRegError(err.response?.data?.message || "Failed to load registrations");
        } finally {
          setRegLoading(false);
        }
      };
      fetchRegistrations();
    }
  }, [activeTab, eventId]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="error" variant="h6">
        Error loading event: {error}
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => window.location.reload()}
        sx={{ mt: 2 }}
      >
        Retry
      </Button>
    </Box>
  );

  if (!event) return (
    <Typography align="center" sx={{ p: 4 }}>
      Event not found
    </Typography>
  );

  return (
    <Box sx={{ p: 4 }}>
           {/* Event Title and Details (unchanged) */}
      <Typography variant="h3" component="h1" gutterBottom align="center">
        {event.ename}
      </Typography>
      
      {/* Rest of your existing event details tab */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Event Details" value="details" />
        <Tab label="Registrations" value="registrations" />
      </Tabs>

      {activeTab === "details" && (
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                <CalendarTodayIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Event Details
              </Typography>
              <Divider sx={{ mb: 2 }}/>
              
              <Stack spacing={2}>
                <Typography>
                  <strong>Organized by:</strong> {event.orgname || 'Not Found'}
                </Typography>
                <Typography>
                  <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography>
                  <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 20 }} />
                  {event.venue}
                </Typography>
                <Typography>
                  <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 20 }} />
                  {event.durofhk}
                </Typography>
                <Typography>
                  <EmojiEventsIcon sx={{ verticalAlign: "middle", mr: 1, fontSize: 20 }} />
                  Prize: {event.prize}
                </Typography>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                <DescriptionIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Description
              </Typography>
              <Divider sx={{ mb: 2 }}/>
              <Typography paragraph>{event.details}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

{activeTab === "registrations" && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Registered Participants ({registrations.length})
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {regLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : regError ? (
            <Typography color="error">{regError}</Typography>
          ) : registrations.length === 0 ? (
            <Typography color="textSecondary">
              No participants registered yet
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Student ID</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg._id}>
                      <TableCell>{reg.studentId || 'N/A'}</TableCell>
                      <TableCell>{reg.name || reg.leaderName || 'N/A'}</TableCell>
                      <TableCell>{reg.email || reg.leaderEmail || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Adminevents;