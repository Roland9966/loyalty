// src/components/common/SubmitButton.tsx
import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface SubmitButtonProps extends ButtonProps {
  loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  children, 
  loading = false, 
  disabled, 
  ...props 
}) => {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      fullWidth
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default SubmitButton;