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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { programsAPI } from '../../services/api';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_days: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await programsAPI.getAll();
      setPrograms(response.data.results || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (program = null) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        name: program.name,
        description: program.description || '',
        duration_days: program.duration_days || '',
      });
    } else {
      setEditingProgram(null);
      setFormData({
        name: '',
        description: '',
        duration_days: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProgram(null);
    setFormData({
      name: '',
      description: '',
      duration_days: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        await programsAPI.update(editingProgram.id, formData);
      } else {
        await programsAPI.create(formData);
      }
      fetchPrograms();
      handleClose();
    } catch (error) {
      console.error('Error saving program:', error);
      setError('Failed to save program');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await programsAPI.delete(id);
        fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
        setError('Failed to delete program');
      }
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
          Programs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Program
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
              <TableCell>Description</TableCell>
              <TableCell>Duration (Days)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.description}</TableCell>
                <TableCell>{program.duration_days}</TableCell>
                <TableCell>
                  <Chip
                    label={program.is_active ? 'Active' : 'Inactive'}
                    color={program.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(program)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(program.id)}
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
          {editingProgram ? 'Edit Program' : 'Add New Program'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Program Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              label="Duration (Days)"
              value={formData.duration_days}
              onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProgram ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Programs;
