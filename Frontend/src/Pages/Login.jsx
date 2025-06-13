import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../context';
import { Snackbar, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useColors } from '../components/ColorContext';
import Button from '../components/Button';

function Login() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
   const {colors}= useColors();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setSnackbarMessage('Please enter email and password');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
          setSnackbarMessage('User name is wrong');
        } else if (error.response.data.message.includes('password')) {
          setSnackbarMessage('Password is wrong');
        } else {
          setSnackbarMessage(error.response.data.message);
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
      {/* <div
        className="relative h-[20vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&q=80&w=2070")' }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div> */}

      <main className="max-w-md mx-auto my-5  pb-12 px-4">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-600 mt-2">Access your restaurant dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm cursor-pointer font-medium text-amber-600 hover:text-amber-500">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={` flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-colors ${
                loading ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </main>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
  </>
  );
}

export default Login;