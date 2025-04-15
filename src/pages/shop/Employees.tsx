// src/pages/shop/Employees.tsx
import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import ProtectedLayout from '../../components/common/ProtectedLayout.tsx';

const ShopEmployees: React.FC = () => {
  return (
    <ProtectedLayout>
      <Paper elevation={3}>
        <Box p={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Alkalmazottak kezelése
          </Typography>
          <Typography variant="body1">
            Itt hozzáadhat, szerkeszthet vagy törölhet alkalmazottakat.
          </Typography>
        </Box>
      </Paper>
    </ProtectedLayout>
  );
};

export default ShopEmployees;