import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import { BASE_URL } from '../../context';
import { useAuth } from '../../context/AuthContext';
import { useColors } from '../../context/ColorContext';
import Button from '../Button';
import { Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { colors } = useColors();
  // const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');

    // Input Validation
    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/user/login`, { email, password });
      if (response?.status === 200) {
        setSnackbarMessage('Login successful!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        login(response?.data?.data);
        navigate('/admin');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes('email')) {
          setSnackbarMessage('Incorrect email');
        } else if (error.response.data.message.includes('password')) {
          setSnackbarMessage('Incorrect password');
        } else {
          setSnackbarMessage(error.response.data.message,"error");
        }
      } else {
        setSnackbarMessage(error.message || 'Login failed');
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label style={{ color: colors.primary }} htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 outline-0 ${
                emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]'
              }`}
              placeholder="Enter your email"
            />
          </div>
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div>
          <label style={{ color: colors.primary }} htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 outline-0 ${
                passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]'
              }`}
              placeholder="Enter your password"
              
            />
             {/* Eye icon to toggle password visibility */}
      <div
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5 text-gray-500" /> // EyeOff icon when password is visible
        ) : (
          <Eye className="h-5 w-5 text-gray-500" /> // Eye icon when password is hidden
        )}
      </div>
          </div>
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>

        <div className="flex items-center justify-between">
          <button style={{ color: colors.primary }} type="button" className="text-sm font-medium text-amber-600 cursor-pointer hover:text-amber-500">
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="border cursor-pointer w-full flex justify-center items-center p-2 rounded-2xl text-white"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default LoginForm;
