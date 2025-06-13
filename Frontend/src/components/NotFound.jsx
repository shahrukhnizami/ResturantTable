import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const NotFound = () => {
  const navigate = useNavigate();
    const { user } = useAuth();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Typography className='text-indigo-800' variant="h1"  fontWeight="bold">
        404
      </Typography>
      <Typography variant="h6"  sx={{ mb: 2 }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button className={"p-2 rounded-xl"} variant="contained"  onClick={() => navigate(user?'/admin' : "/")}>
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
