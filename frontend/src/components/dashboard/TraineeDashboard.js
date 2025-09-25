import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
} from '@mui/material';
import {
  School,
  VideoCall,
  AccessTime,
  Person,
} from '@mui/icons-material';
import { classesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TraineeDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await classesAPI.getAll();
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = (meetLink) => {
    if (meetLink) {
      window.open(meetLink, '_blank');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Trainee Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Classes
              </Typography>
              {classes.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No classes available at the moment.
                </Typography>
              ) : (
                <List>
                  {classes.map((classItem, index) => (
                    <div key={classItem.id}>
                      <ListItem>
                        <ListItemIcon>
                          <School color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="h6">{classItem.name}</Typography>
                              {classItem.google_meet_link && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleJoinClass(classItem.google_meet_link)}
                                  title="Join Google Meet"
                                >
                                  <VideoCall />
                                </IconButton>
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Box display="flex" alignItems="center" gap={2} mt={1}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <Person fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    {classItem.trainer_name}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <AccessTime fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    {classItem.class_timings}
                                  </Typography>
                                </Box>
                              </Box>
                              {classItem.description && (
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                  {classItem.description}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < classes.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<VideoCall />}
                  onClick={() => {
                    // This would typically open a modal or redirect to a video call interface
                    alert('Video call functionality would be implemented here');
                  }}
                  fullWidth
                >
                  Join Scheduled Class
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<School />}
                  fullWidth
                >
                  View Class Materials
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Progress
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Progress tracking will be displayed here
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TraineeDashboard;
