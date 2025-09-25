import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  School,
  Group,
  Assessment,
  People,
} from '@mui/icons-material';
import { programsAPI, batchesAPI, batchTraineesAPI, progressAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    programs: 0,
    batches: 0,
    trainees: 0,
    progress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchStats();
  }, []);

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
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

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
                Recent Activity
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Activity tracking will be implemented here
              </Typography>
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
                  label="Create Program"
                  color="primary"
                  variant="outlined"
                  clickable
                />
                <Chip
                  label="Start Batch"
                  color="secondary"
                  variant="outlined"
                  clickable
                />
                <Chip
                  label="View Reports"
                  color="success"
                  variant="outlined"
                  clickable
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
