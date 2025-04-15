// src/pages/shop/Transactions.tsx
import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import ProtectedLayout from '../../components/common/ProtectedLayout.tsx';

const ShopTransactions: React.FC = () => {
  return (
    <ProtectedLayout>
      <Paper elevation={3}>
        <Box p={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tranzakciók
          </Typography>
          <Typography variant="body1">
            Itt láthatja az összes tranzakciót és a hozzáadott hűségpontokat.
          </Typography>
        </Box>
      </Paper>
    </ProtectedLayout>
  );
};

export default ShopTransactions;