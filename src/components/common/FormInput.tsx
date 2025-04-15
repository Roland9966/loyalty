// src/components/common/FormInput.tsx
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface FormInputProps extends Omit<TextFieldProps, 'error'> {
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ error, ...props }) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      error={!!error}
      helperText={error}
      {...props}
    />
  );
};

export default FormInput;