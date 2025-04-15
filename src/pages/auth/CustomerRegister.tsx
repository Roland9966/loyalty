// src/pages/auth/CustomerRegister.tsx
import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Link, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import FormInput from '../../components/common/FormInput.tsx';
import SubmitButton from '../../components/common/SubmitButton.tsx';
import { useAuth, CustomerRegisterData } from '../../contexts/AuthContext.tsx';

const CustomerRegister: React.FC = () => {
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CustomerRegisterData>({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Töröljük a hibát, amikor a felhasználó szerkeszti a mezőt
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'A név megadása kötelező';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Az e-mail cím megadása kötelező';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Érvénytelen e-mail cím';
    }
    
    if (!formData.password) {
      newErrors.password = 'A jelszó megadása kötelező';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A jelszónak legalább 6 karakter hosszúnak kell lennie';
    }
    
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'A jelszavak nem egyeznek';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await registerCustomer(formData);
      if (success) {
        // Átirányítás a bejelentkezési oldalra
        navigate('/login', { state: { message: 'Sikeres regisztráció! Most már bejelentkezhet.' } });
      } else {
        setErrors({ form: 'Hiba történt a regisztráció során. Kérjük, próbálja újra.' });
      }
    } catch (error) {
      setErrors({ form: 'Váratlan hiba történt. Kérjük, próbálja újra később.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box py={4}>
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Vásárlói regisztráció
            </Typography>
            
            <Typography variant="body2" color="textSecondary" align="center" paragraph>
              Hozzon létre egy fiókot a hűségpontok gyűjtéséhez
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {errors.form && (
              <Typography color="error" align="center" paragraph>
                {errors.form}
              </Typography>
            )}
            
            <form onSubmit={handleSubmit}>
              <FormInput
                name="name"
                label="Teljes név"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              
              <FormInput
                name="email"
                label="E-mail cím"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              
              <FormInput
                name="phoneNumber"
                label="Telefonszám (opcionális)"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              
              <FormInput
                name="password"
                label="Jelszó"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              
              <FormInput
                name="confirmPassword"
                label="Jelszó megerősítése"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={errors.confirmPassword}
                required
              />
              
              <Box mt={3}>
                <SubmitButton loading={isSubmitting}>
                  Regisztráció
                </SubmitButton>
              </Box>
              
              <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  Már van fiókja?{' '}
                  <Link component={RouterLink} to="/login">
                    Bejelentkezés
                  </Link>
                </Typography>
              </Box>
              
              <Box mt={1} textAlign="center">
                <Typography variant="body2">
                  Bolt regisztráció?{' '}
                  <Link component={RouterLink} to="/register/shop">
                    Kattintson ide
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CustomerRegister;