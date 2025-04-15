// src/components/common/ProtectedLayout.tsx
import React from "react";
import { Container, Box } from "@mui/material";
import Navigation from "./Navigation.tsx";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <>
      <Navigation />
      <Container maxWidth="lg">
        <Box py={3}>{children}</Box>
      </Container>
    </>
  );
};

export default ProtectedLayout;
