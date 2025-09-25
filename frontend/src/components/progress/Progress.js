import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import { progressAPI, batchTraineesAPI } from '../../services/api';

const Progress = () => {
  const [progressRecords, setProgressRecords] = useState([]);
  const [batchTrainees, setBatchTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [progressRes, traineesRes] = await Promise.all([
        progressAPI.getAll(),
        batchTraineesAPI.getAll(),
      ]);
      setProgressRecords(progressRes.data.results || []);
      setBatchTrainees(traineesRes.data.results || []);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setError('Failed to fetch progress data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'not_started': return 'default';
      case 'in_progress': return 'primary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getTraineeName = (traineeId) => {
    const trainee = batchTrainees.find(bt => bt.trainee === traineeId);
    return trainee ? trainee.trainee_name : 'Unknown';
  };

  const getBatchName = (batchId) => {
    const trainee = batchTrainees.find(bt => bt.batch === batchId);
    return trainee ? trainee.batch_name : 'Unknown';
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
        Progress Tracking
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trainee</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {progressRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{getTraineeName(record.trainee)}</TableCell>
                <TableCell>{getBatchName(record.batch)}</TableCell>
                <TableCell>{record.topic_name || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                      <LinearProgress
                        variant="determinate"
                        value={record.completion_percentage}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Box minWidth={35}>
                      <Typography variant="body2" color="textSecondary">
                        {record.completion_percentage}%
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{record.notes || 'No notes'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Progress;
