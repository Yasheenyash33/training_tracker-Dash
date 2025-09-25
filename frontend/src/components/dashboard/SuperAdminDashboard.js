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
  MenuItem,
  Alert,
} from '@mui/material';
import {
  School,
  Group,
  People,
  PersonAdd,
  Assessment,
} from '@mui/icons-material';
import { usersAPI, programsAPI, batchesAPI, batchTraineesAPI, progressAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const SuperAdminDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    programs: 0,
    batches: 0,
    trainees: 0,
    progress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'trainee',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [programsRes, batchesRes, traineesRes, progressRes] = await Promise.all([
        programsAPI.getAll(),
        batchesAPI.getAll(),
        batchTraineesAPI.getAll(),
        progressAPI.getAll(),
      ]);

      setStats({
        programs: programsRes.data.length,
        batches: batchesRes.data.length,
        trainees: traineesRes.data.length,
        progress: progressRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setError('');
      await usersAPI.create(newUser);
      setCreateUserOpen(false);
      setNewUser({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'trainee',
      });
      fetchStats(); // Refresh stats
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating user');
    }
  };

  const statCards = [
    {
      title: 'Total Programs',
      value: stats.programs,
      icon: <School />,
      color: '#1976d2',
    },
    {
      title: 'Active Batches',
      value: stats.batches,
      icon: <Group />,
      color: '#388e3c',
    },
    {
      title: 'Total Trainees',
      value: stats.trainees,
      icon: <People />,
      color: '#f57c00',
    },
    {
      title: 'Progress Records',
      value: stats.progress,
      icon: <Assessment />,
      color: '#7b1fa2',
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
          Super Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAdd />}
          onClick={() => setCreateUserOpen(true)}
        >
          Create User
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
                Quick Actions
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  label="Manage Users"
                  color="primary"
                  variant="outlined"
                  clickable
                />
                <Chip
                  label="View Reports"
                  color="secondary"
                  variant="outlined"
                  clickable
                />
                <Chip
                  label="System Settings"
                  color="success"
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
                User Management
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create and manage trainer and trainee accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create User Dialog */}
      <Dialog open={createUserOpen} onClose={() => setCreateUserOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <TextField
            margin="dense"
            label="First Name"
            fullWidth
            variant="outlined"
            value={newUser.first_name}
            onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            variant="outlined"
            value={newUser.last_name}
            onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Role"
            fullWidth
            variant="outlined"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <MenuItem value="trainer">Trainer</MenuItem>
            <MenuItem value="trainee">Trainee</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateUserOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained" color="primary">
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminDashboard;
