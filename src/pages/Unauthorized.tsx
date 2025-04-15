// src/pages/Unauthorized.tsx - frissítés
import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Átirányítás a megfelelő kezdőlapra a felhasználó szerepköre alapján
    if (user) {
      if (user.role === 'customer') {
        navigate('/customer');
      } else if (user.role === 'shop_admin' || user.role === 'shop_employee') {
        navigate('/shop');
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box py={4}>
        <Paper elevation={3}>
          <Box p={3} textAlign="center">
            <Typography variant="h4" component="h1" color="error" gutterBottom>
              Hozzáférés megtagadva
            </Typography>
            
            <Typography variant="body1" paragraph>
              Önnek nincs megfelelő jogosultsága a kért oldal megtekintéséhez.
              {user && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Jelenlegi szerepköre: {
                    user.role === 'customer' ? 'Vásárló' :
                    user.role === 'shop_admin' ? 'Bolt adminisztrátor' :
                    user.role === 'shop_employee' ? 'Bolt alkalmazott' : 
                    'Ismeretlen'
                  }
                </Typography>
              )}
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleGoBack}
              sx={{ mt: 2 }}
            >
              Vissza a kezdőlapra
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized;