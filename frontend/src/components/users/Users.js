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
  Button,
  Tabs,
  Tab,
  Pagination,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { usersAPI } from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: '',
    expertise: '',
    designation: '',
  });
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page: pagination.currentPage };
      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }
      const response = await usersAPI.getAll(params);
      setUsers(response.data.results || []);
      setPagination({
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
        currentPage: pagination.currentPage,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        role: user.role || '',
        expertise: user.expertise || '',
        designation: user.designation || '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        role: '',
        expertise: '',
        designation: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: '',
      expertise: '',
      designation: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersAPI.update(editingUser.id, formData);
      } else {
        await usersAPI.create(formData);
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'trainer': return 'primary';
      case 'trainee': return 'success';
      default: return 'default';
    }
  };

  const handleRoleFilterChange = (event, newValue) => {
    setRoleFilter(newValue);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
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
          Users
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={roleFilter} onChange={handleRoleFilterChange} aria-label="user role filter">
          <Tab label="All Users" value="all" />
          <Tab label="Admins" value="admin" />
          <Tab label="Trainers" value="trainer" />
          <Tab label="Trainees" value="trainee" />
        </Tabs>
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
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role || 'No role'}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.is_active ? 'Active' : 'Inactive'}
                    color={user.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination 
          count={Math.ceil(pagination.count / 20)} 
          page={pagination.currentPage} 
          onChange={handlePageChange} 
          color="primary"
        />
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="First Name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="trainer">Trainer</MenuItem>
                <MenuItem value="trainee">Trainee</MenuItem>
              </Select>
            </FormControl>
            {formData.role === 'trainer' && (
              <TextField
                margin="normal"
                fullWidth
                multiline
                rows={3}
                label="Expertise Areas"
                placeholder="e.g., Python, JavaScript, Data Science"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              />
            )}
            {formData.role === 'trainee' && (
              <TextField
                margin="normal"
                fullWidth
                label="Designation"
                placeholder="e.g., Software Engineer, Data Analyst"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
