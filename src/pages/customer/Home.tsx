// src/pages/customer/Home.tsx
import React from "react";
import { Typography, Paper, Box, Divider } from "@mui/material";
import ProtectedLayout from "../../components/common/ProtectedLayout.tsx";
import ShopList from "../../components/customer/ShopList.tsx";

const CustomerHome: React.FC = () => {
  return (
    <ProtectedLayout>
      <Paper elevation={3}>
        <Box p={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Üzletek
          </Typography>
          <Typography variant="body1" paragraph>
            Üdvözöljük a Hűségkártya alkalmazásban! Az alábbiakban böngészhet az elérhető
            üzletek között, ahol pontokat gyűjthet vásárlásai után.
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <ShopList />
        </Box>
      </Paper>
    </ProtectedLayout>
  );
};

export default CustomerHome;

