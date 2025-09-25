import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  School,
  Group,
  VideoCall,
  Add,
} from '@mui/icons-material';
import { classesAPI, batchesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TrainerDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    classes: 0,
    batches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [createClassOpen, setCreateClassOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    trainer_name: '',
    class_timings: '',
    google_meet_link: '',
    description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [classesRes, batchesRes] = await Promise.all([
        classesAPI.getAll(),
        batchesAPI.getAll(),
      ]);

      setStats({
        classes: classesRes.data.length,
        batches: batchesRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async () => {
    try {
      setError('');
      await classesAPI.create(newClass);
      setCreateClassOpen(false);
      setNewClass({
        name: '',
        trainer_name: '',
        class_timings: '',
        google_meet_link: '',
        description: '',
      });
      fetchStats(); // Refresh stats
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating class');
    }
  };

  const statCards = [
    {
      title: 'My Classes',
      value: stats.classes,
      icon: <School />,
      color: '#1976d2',
    },
    {
      title: 'Active Batches',
      value: stats.batches,
      icon: <Group />,
      color: '#388e3c',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Trainer Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setCreateClassOpen(true)}
        >
          Add Class
        </Button>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="h2">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: card.color,
                      borderRadius: '50%',
                      p: 1,
                      color: 'white',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Class Management
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={2}>
                Create and manage your training classes
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  label="Add New Class"
                  color="primary"
                  variant="outlined"
                  clickable
                  onClick={() => setCreateClassOpen(true)}
                />
                <Chip
                  label="View All Classes"
                  color="secondary"
                  variant="outlined"
                  clickable
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  label="Schedule Class"
                  color="success"
                  variant="outlined"
                  clickable
                />
                <Chip
                  label="Join Google Meet"
                  color="warning"
                  variant="outlined"
                  clickable
                  icon={<VideoCall />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Class Dialog */}
      <Dialog open={createClassOpen} onClose={() => setCreateClassOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Class</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Class Name"
            fullWidth
            variant="outlined"
            value={newClass.name}
            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
            placeholder="e.g., React Development Basics"
          />
          <TextField
            margin="dense"
            label="Trainer Name"
            fullWidth
            variant="outlined"
            value={newClass.trainer_name}
            onChange={(e) => setNewClass({ ...newClass, trainer_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Class Timings"
            fullWidth
            variant="outlined"
            value={newClass.class_timings}
            onChange={(e) => setNewClass({ ...newClass, class_timings: e.target.value })}
            placeholder="e.g., Mon, Wed, Fri 10:00 AM - 12:00 PM"
          />
          <TextField
            margin="dense"
            label="Google Meet Link"
            fullWidth
            variant="outlined"
            value={newClass.google_meet_link}
            onChange={(e) => setNewClass({ ...newClass, google_meet_link: e.target.value })}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newClass.description}
            onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateClassOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateClass} variant="contained" color="primary">
            Create Class
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerDashboard;
