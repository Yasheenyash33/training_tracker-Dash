import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Alert,
  Container
} from '@mui/material';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    password2: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setErrors({ general: 'Invalid reset link. Please request a new password reset.' });
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }
    if (!formData.password2) newErrors.password2 = 'Please confirm your password';

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
      await authAPI.passwordResetConfirm(token, formData.password);
      navigate('/login', {
        state: { message: 'Password reset successfully! Please log in with your new password.' }
      });
    } catch (error) {
      setErrors(error.response?.data || { general: 'Password reset failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Reset Password
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Enter your new password below.
          </Typography>

          {errors.general && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm New Password"
              type="password"
              id="password2"
              value={formData.password2}
              onChange={handleChange}
              error={!!errors.password2}
              helperText={errors.password2}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;
