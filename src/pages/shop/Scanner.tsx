// src/pages/shop/Scanner.tsx
import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import ProtectedLayout from '../../components/common/ProtectedLayout.tsx';

const ShopScanner: React.FC = () => {
  return (
    <ProtectedLayout>
      <Paper elevation={3}>
        <Box p={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            QR Kód Scanner
          </Typography>
          <Typography variant="body1">
            Olvassa be a vásárló QR kódját a hűségpontok hozzáadásához.
          </Typography>
        </Box>
      </Paper>
    </ProtectedLayout>
  );
};

export default ShopScanner;