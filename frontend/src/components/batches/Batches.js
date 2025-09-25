import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { batchesAPI, programsAPI } from '../../services/api';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    program: '',
    start_date: '',
    end_date: '',
    status: 'scheduled',
    max_capacity: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [batchesRes, programsRes] = await Promise.all([
        batchesAPI.getAll(),
        programsAPI.getAll(),
      ]);
      setBatches(batchesRes.data.results || []);
      setPrograms(programsRes.data.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (batch = null) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        name: batch.name,
        program: batch.program,
        start_date: batch.start_date,
        end_date: batch.end_date,
        status: batch.status,
        max_capacity: batch.max_capacity,
      });
    } else {
      setEditingBatch(null);
      setFormData({
        name: '',
        program: '',
        start_date: '',
        end_date: '',
        status: 'scheduled',
        max_capacity: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBatch(null);
    setFormData({
      name: '',
      program: '',
      start_date: '',
      end_date: '',
      status: 'scheduled',
      max_capacity: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBatch) {
        await batchesAPI.update(editingBatch.id, formData);
      } else {
        await batchesAPI.create(formData);
      }
      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error saving batch:', error);
      setError('Failed to save batch');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await batchesAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting batch:', error);
        setError('Failed to delete batch');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'running': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Batches
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Batch
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell>{batch.name}</TableCell>
                <TableCell>{batch.program_name}</TableCell>
                <TableCell>{batch.start_date}</TableCell>
                <TableCell>{batch.end_date}</TableCell>
                <TableCell>
                  <Chip
                    label={batch.status}
                    color={getStatusColor(batch.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{batch.max_capacity}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(batch)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(batch.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBatch ? 'Edit Batch' : 'Add New Batch'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Batch Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Program</InputLabel>
              <Select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              >
                {programs.map((program) => (
                  <MenuItem key={program.id} value={program.id}>
                    {program.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              type="date"
              label="Start Date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              fullWidth
              type="date"
              label="End Date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="running">Running</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              label="Max Capacity"
              value={formData.max_capacity}
              onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBatch ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Batches;
