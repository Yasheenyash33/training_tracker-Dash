import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Alert,
  Container, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', password2: '',
    first_name: '', last_name: '', phone: '', role: 'trainee'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';

    // Password strength validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate('/login', {
        state: { message: 'Registration successful! Please log in.' }
      });
    } catch (error) {
      const errorData = error.response?.data || {};
      if (errorData.username || errorData.email || errorData.password) {
        setErrors(errorData);
      } else {
        setErrors({ general: errorData.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Create Account
          </Typography>

          {errors.general && <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal" required fullWidth
              label="Username" name="username"
              value={formData.username} onChange={handleChange}
              error={!!errors.username} helperText={errors.username}
            />

            <TextField
              margin="normal" required fullWidth
              label="Email Address" name="email" type="email"
              value={formData.email} onChange={handleChange}
              error={!!errors.email} helperText={errors.email}
            />

            <TextField
              margin="normal" required fullWidth
              label="First Name" name="first_name"
              value={formData.first_name} onChange={handleChange}
              error={!!errors.first_name} helperText={errors.first_name}
            />

            <TextField
              margin="normal" required fullWidth
              label="Last Name" name="last_name"
              value={formData.last_name} onChange={handleChange}
              error={!!errors.last_name} helperText={errors.last_name}
            />

            <TextField
              margin="normal" fullWidth
              label="Phone Number" name="phone"
              value={formData.phone} onChange={handleChange}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <MenuItem value="trainee">Trainee</MenuItem>
                <MenuItem value="trainer">Trainer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal" required fullWidth
              label="Password" name="password" type="password"
              value={formData.password} onChange={handleChange}
              error={!!errors.password} helperText={errors.password}
            />

            <TextField
              margin="normal" required fullWidth
              label="Confirm Password" name="password2" type="password"
              value={formData.password2} onChange={handleChange}
              error={!!errors.password2} helperText={errors.password2}
            />

            <Button
              type="submit" fullWidth variant="contained"
              sx={{ mt: 3, mb: 2 }} disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
