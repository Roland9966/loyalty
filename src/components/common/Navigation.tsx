// src/components/common/Navigation.tsx - javított verzió
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Divider, Avatar } from '@mui/material';
import { Menu as MenuIcon, ExitToApp, Person } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { customerRoutes, shopRoutes } from '../../config/routes.config.ts';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Külön állapotok a különböző menükhöz
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);
  
  // Ha nincs bejelentkezett felhasználó, nincs navigáció
  if (!user) return null;
  
  // Szerepkör alapján válasszuk ki a megfelelő útvonalakat
  const routes = user.role === 'customer' ? customerRoutes : shopRoutes;
  
  // Profil menü kezelése
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  
  // Mobil menü kezelése
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };
  
  // Kijelentkezés
  const handleLogout = () => {
    handleProfileMenuClose();
    handleMobileMenuClose();
    logout();
  };
  
  // Első betű nagybetűvé alakítása a felhasználó nevéből
  const getInitial = () => {
    return user.name ? user.name.charAt(0).toUpperCase() : "U";
  };
  
  return (
    <AppBar position="static" sx={{ boxShadow: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Applikáció címe */}
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {user.role === 'customer' ? 'Hűségkártya Vásárló' : 'Hűségkártya Üzlet'}
        </Typography>
        
        {/* Desktop navigációs menü */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {routes.map((route) => (
            <Button
              key={route.path}
              component={RouterLink}
              to={route.path}
              color="inherit"
              sx={{ 
                mx: 1, 
                py: 1,
                fontWeight: location.pathname === route.path ? 'bold' : 'normal',
                borderBottom: location.pathname === route.path ? '2px solid grey' : 'none'
              }}
            >
              {route.title}
            </Button>
          ))}
          
          {/* Profil gomb */}
          <Box sx={{ ml: 2 }}>
            <IconButton
              edge="end"
              aria-label="felhasználói fiók"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark', color: 'white' }}>
                {getInitial()}
              </Avatar>
            </IconButton>
          </Box>
        </Box>
        
        {/* Mobil hamburger menü */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menü"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        
        {/* Profil legördülő menü */}
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{ mt: 1 }}
        >
          <MenuItem disabled sx={{ opacity: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Bejelentkezve mint: <b>{user.name}</b>
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem 
            component={RouterLink} 
            to={user.role === 'customer' ? '/customer/profile' : '/shop/profile'}
            onClick={handleProfileMenuClose}
          >
            <Person fontSize="small" sx={{ mr: 1 }} />
            Profilom
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToApp fontSize="small" sx={{ mr: 1 }} />
            Kijelentkezés
          </MenuItem>
        </Menu>
        
        {/* Mobil menü */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          sx={{ mt: 1 }}
        >
          {routes.map((route) => (
            <MenuItem
              key={route.path}
              component={RouterLink}
              to={route.path}
              onClick={handleMobileMenuClose}
              selected={location.pathname === route.path}
            >
              {route.title}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem 
            component={RouterLink} 
            to={user.role === 'customer' ? '/customer/profile' : '/shop/profile'}
            onClick={handleMobileMenuClose}
          >
            <Person fontSize="small" sx={{ mr: 1 }} />
            Profilom
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToApp fontSize="small" sx={{ mr: 1 }} />
            Kijelentkezés
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;