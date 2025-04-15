// src/pages/auth/ShopRegister.tsx
import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Link, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import FormInput from '../../components/common/FormInput.tsx';
import SubmitButton from '../../components/common/SubmitButton.tsx';
import { useAuth, ShopRegisterData } from '../../contexts/AuthContext.tsx';

const ShopRegister: React.FC = () => {
  const { registerShop } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ShopRegisterData>({
    shopName: '',
    adminName: '',
    email: '',
    password: '',
    address: ''
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Az üzlet neve kötelező';
    }
    
    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Az adminisztrátor neve kötelező';
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
      const success = await registerShop(formData);
      if (success) {
        navigate('/login', { state: { message: 'Sikeres bolt regisztráció! Most már bejelentkezhet.' } });
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
              Bolt regisztráció
            </Typography>
            
            <Typography variant="body2" color="textSecondary" align="center" paragraph>
              Hozzon létre egy üzleti fiókot a hűségpontok kezeléséhez
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {errors.form && (
              <Typography color="error" align="center" paragraph>
                {errors.form}
              </Typography>
            )}
            
            <form onSubmit={handleSubmit}>
              <FormInput
                name="shopName"
                label="Üzlet neve"
                value={formData.shopName}
                onChange={handleChange}
                error={errors.shopName}
                required
              />
              
              <FormInput
                name="adminName"
                label="Adminisztrátor neve"
                value={formData.adminName}
                onChange={handleChange}
                error={errors.adminName}
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
                name="address"
                label="Üzlet címe (opcionális)"
                value={formData.address}
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
                  Bolt regisztrálása
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
                  Vásárlói regisztráció?{' '}
                  <Link component={RouterLink} to="/register/customer">
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

export default ShopRegister;