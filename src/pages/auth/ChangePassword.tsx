// src/pages/auth/ChangePassword.tsx - továbbfejlesztett verzió
import React, { useState } from 'react';
import { 
  Container, Typography, Paper, Box, Button, Snackbar, Alert,
  Divider, LinearProgress, IconButton
} from '@mui/material';
import { 
  LockOutlined as LockIcon, 
  Visibility, 
  VisibilityOff,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProtectedLayout from '../../components/common/ProtectedLayout.tsx';
import FormInput from '../../components/common/FormInput.tsx';
import SubmitButton from '../../components/common/SubmitButton.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';

const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Töröljük a mezőhöz tartozó hibát, ha van
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Jelszó erősség mérése
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Hossz ellenőrzése
    if (password.length >= 8) strength += 25;
    else if (password.length >= 6) strength += 10;
    
    // Kisbetű ellenőrzése
    if (/[a-z]/.test(password)) strength += 15;
    
    // Nagybetű ellenőrzése
    if (/[A-Z]/.test(password)) strength += 20;
    
    // Szám ellenőrzése
    if (/[0-9]/.test(password)) strength += 20;
    
    // Speciális karakter ellenőrzése
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    // Maximum 100%
    return Math.min(100, strength);
  };
  
  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 30) return '#f44336'; // gyenge - piros
    if (strength < 60) return '#ff9800'; // közepes - narancssárga
    return '#4caf50'; // erős - zöld
  };
  
  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 30) return 'Gyenge';
    if (strength < 60) return 'Közepes';
    return 'Erős';
  };
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'A jelenlegi jelszó megadása kötelező';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Az új jelszó megadása kötelező';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Az új jelszónak legalább 6 karakter hosszúnak kell lennie';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
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
    
    setIsLoading(true);
    
    try {
      // Itt normál esetben API-hívást tennénk a jelszó módosításához
      // Most csak egy késleltetést szimulálunk
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotification({
        open: true,
        message: 'A jelszó sikeresen módosítva!',
        severity: 'success'
      });
      
      // Űrlap adatok törlése
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Rövid szünet után visszanavigálunk a profil oldalra
      setTimeout(() => {
        const returnPath = user?.role === 'customer' ? '/customer/profile' : '/shop/profile';
        navigate(returnPath);
      }, 2000);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Hiba történt a jelszó módosítása során.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  const handleCancel = () => {
    const returnPath = user?.role === 'customer' ? '/customer/profile' : '/shop/profile';
    navigate(returnPath);
  };
  
  const passwordStrength = calculatePasswordStrength(formData.newPassword);
  const strengthColor = getPasswordStrengthColor(passwordStrength);
  const strengthText = getPasswordStrengthText(passwordStrength);
  
  return (
    <ProtectedLayout>
      <Container maxWidth="sm">
        <Box py={4}>
          <Paper elevation={3}>
            <Box p={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <IconButton
                  color="primary"
                  onClick={handleCancel}
                  sx={{ mr: 2 }}
                >
                  <ArrowBack />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <LockIcon />
                  </Box>
                  <Typography variant="h4" component="h1">
                    Jelszó módosítása
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                A biztonságos jelszó legalább 8 karakter hosszú, tartalmaz nagybetűt, kisbetűt, számot és speciális karaktert.
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <FormInput
                  name="currentPassword"
                  label="Jelenlegi jelszó"
                  type={showPassword.currentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  error={errors.currentPassword}
                  required
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => togglePasswordVisibility('currentPassword')}
                        edge="end"
                      >
                        {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                />
                
                <FormInput
                  name="newPassword"
                  label="Új jelszó"
                  type={showPassword.newPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => togglePasswordVisibility('newPassword')}
                        edge="end"
                      >
                        {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                />
                
                {formData.newPassword && (
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">
                        Jelszó erőssége:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ fontWeight: 'bold', color: strengthColor }}
                      >
                        {strengthText}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={passwordStrength} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'grey.300',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: strengthColor
                        }
                      }} 
                    />
                    <Box mt={1}>
                      <Typography variant="caption" color="text.secondary">
                        Tipp: Használj legalább 8 karaktert, nagybetűt, kisbetűt, számot és speciális karaktert a biztonságos jelszóhoz.
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                <FormInput
                  name="confirmPassword"
                  label="Új jelszó megerősítése"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        edge="end"
                      >
                        {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                />
                
                <Box mt={3} display="flex" justifyContent="space-between">
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{ width: "45%" }}
                  >
                    Mégse
                  </Button>
                  <SubmitButton 
                    loading={isLoading}
                    sx={{ width: "45%" }}
                  >
                    Jelszó módosítása
                  </SubmitButton>
                </Box>
              </form>
            </Box>
          </Paper>
        </Box>
      </Container>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ProtectedLayout>
  );
};

export default ChangePassword;