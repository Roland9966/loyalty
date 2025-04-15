// src/pages/customer/ShopDetails.tsx
import React, { useEffect, useState } from "react";
import { 
  Typography, 
  Paper, 
  Box, 
  CircularProgress, 
  Button, 
  Divider, 
  Chip, 
  Alert,
  IconButton,

  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ProtectedLayout from "../../components/common/ProtectedLayout.tsx";
import { ShopService } from "../../services/shop.service.ts";
import { Shop } from "../../types/shop.types.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import TransactionsList from "../../components/customer/TransactionsList.tsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

import ShopPointsSummary from '../../components/customer/ShopPointsSummary.tsx';
import PointsHistory from '../../components/customer/PointsHistory.tsx';
// Adjuk hozzá a hiányzó importot az ikonhoz
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`shop-tabpanel-${index}`}
      aria-labelledby={`shop-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ShopDetails: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock adatok a demózáshoz (ezeket később le lehet cserélni valós adatokra)
  // const mockPointsData = {
  //   currentPoints: 230,
  //   totalPointsEarned: 450,
  //   lastTransaction: "2023-04-08T15:30:00"
  // };

  // const mockTransactions = [
  //   { id: "t1", date: "2023-04-08", amount: 2500, pointsEarned: 25 },
  //   { id: "t2", date: "2023-03-25", amount: 4800, pointsEarned: 48 },
  //   { id: "t3", date: "2023-03-12", amount: 3200, pointsEarned: 32 }
  // ];

  const mockOpeningHours = [
    { day: "Hétfő", hours: "09:00 - 18:00" },
    { day: "Kedd", hours: "09:00 - 18:00" },
    { day: "Szerda", hours: "09:00 - 18:00" },
    { day: "Csütörtök", hours: "09:00 - 18:00" },
    { day: "Péntek", hours: "09:00 - 19:00" },
    { day: "Szombat", hours: "10:00 - 14:00" },
    { day: "Vasárnap", hours: "Zárva" }
  ];

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!shopId) {
         setError("Bolt azonosító hiányzik.");
        setLoading(false);
        
        return;
      }

      try {
        setLoading(true);
        const shopData = await ShopService.getShopById(shopId);
        setShop(shopData);
        setError(null);
      } catch (err) {
        console.error("Hiba a bolt adatainak betöltésekor:", err);
        setError("Nem sikerült betölteni a bolt részleteit. Kérjük, próbálja újra később.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGenerateQR = () => {
    navigate(`/customer/shops/${shopId}/qrcode`);
  };

  const handleViewPoints = () => {
    navigate(`/customer/points?shopId=${shopId}`);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </ProtectedLayout>
    );
  }

  if (error || !shop) {
    return (
      <ProtectedLayout>
        <Paper elevation={3}>
          <Box p={3}>
            <IconButton onClick={handleGoBack} sx={{ mb: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Alert severity="error">{error || "A bolt nem található."}</Alert>
            <Box mt={2}>
              <Button variant="outlined" onClick={handleGoBack}>
                Vissza a boltokhoz
              </Button>
            </Box>
          </Box>
        </Paper>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <Paper elevation={3}>
        <Box p={3}>
          {/* Fejléc */}
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              {shop.name}
            </Typography>
          </Box>

          {/* Kategória címke */}
          {shop.category && (
            <Chip 
              label={shop.category} 
              color="primary" 
              variant="outlined" 
              sx={{ mb: 2 }} 
            />
          )}

          {/* Bolt logo/ikon */}
          <Box 
            sx={{ 
              mb: 3, 
              height: 180, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              bgcolor: shop.logo ? "transparent" : "primary.light",
              borderRadius: 1,
              overflow: "hidden"
            }}
          >
            {shop.logo ? (
              <img 
                src={shop.logo} 
                alt={shop.name} 
                style={{ maxWidth: "100%", maxHeight: "100%" }} 
              />
            ) : (
              <StorefrontIcon sx={{ fontSize: 80, color: "white" }} />
            )}
          </Box>

          {/* Tab menü az információk közötti váltáshoz */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Információk" id="shop-tab-0" aria-controls="shop-tabpanel-0" />
              <Tab label="Pontok" id="shop-tab-1" aria-controls="shop-tabpanel-1" />
              <Tab label="Tranzakciók" id="shop-tab-2" aria-controls="shop-tabpanel-2" />
            </Tabs>
          </Box>

          {/* Információk tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              A boltról
            </Typography>
            <Typography variant="body1" paragraph>
              {shop.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Cím és elérhetőségek */}
              <Box sx={{ flex: 1 }}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Cím" secondary={shop.address} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Telefonszám" secondary={shop.phone || "Nincs megadva"} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="E-mail" secondary={shop.email || "Nincs megadva"} />
                  </ListItem>
                </List>
              </Box>

              {/* Nyitvatartás */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                    Nyitvatartás
                  </Box>
                </Typography>
                <List dense>
                  {mockOpeningHours.map((item) => (
                    <ListItem key={item.day} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={item.day} 
                        secondary={item.hours}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                        secondaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Pontgyűjtési információ */}
            <Box 
              p={2} 
              mb={3} 
              sx={{ 
                bgcolor: "primary.light", 
                color: "primary.contrastText",
                borderRadius: 1
              }}
            >
              <Typography variant="h6" gutterBottom>
                Pontgyűjtési információ
              </Typography>
              <Typography variant="body1">
                {shop.pointsPerCurrency} pont minden elköltött 100 Ft után
              </Typography>
            </Box>
          </TabPanel>

          {/* Pontok tab */}
          <TabPanel value={tabValue} index={1}>
  {user && shopId && (
    <>
      <ShopPointsSummary userId={user.id} shopId={shopId} />
      
      <Box sx={{ mt: 4 }}>
        <PointsHistory userId={user.id} shopId={shopId} limit={3} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={handleViewPoints}
            endIcon={<ArrowForwardIcon />}
          >
            Összes tranzakció megtekintése
          </Button>
        </Box>
      </Box>
    </>
  )}
</TabPanel>

          {/* Tranzakciók tab */}
          <TabPanel value={tabValue} index={2}>
  <Typography variant="h6" gutterBottom>
    Korábbi tranzakciók
  </Typography>

  {user && shopId && (
    <TransactionsList userId={user.id} shopId={shopId} />
  )}

  <Box mt={3}>
    <Button 
      variant="outlined" 
      fullWidth
      onClick={handleViewPoints}
    >
      Összes tranzakció megtekintése
    </Button>
  </Box>
</TabPanel>
         
          <Divider sx={{ my: 2 }} />

          {/* Akciógombok */}
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" },
              gap: 2
            }}
          >
            <Button 
              variant="contained" 
              startIcon={<QrCodeIcon />}
              fullWidth
              onClick={handleGenerateQR}
            >
              QR Kód Generálása
            </Button>
            
            <Button 
              variant="outlined"
              fullWidth
              onClick={handleViewPoints}
            >
              Pontjaim megtekintése
            </Button>
          </Box>
        </Box>
      </Paper>
    </ProtectedLayout>
  );
};

export default ShopDetails;