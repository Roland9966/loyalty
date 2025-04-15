// src/pages/customer/ShopQRCode.tsx
import React, { useEffect, useState } from "react";
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  CircularProgress, 
  Alert,
  IconButton,
  Divider
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ProtectedLayout from "../../components/common/ProtectedLayout.tsx";
import { ShopService } from "../../services/shop.service.ts";
import { Shop } from "../../types/shop.types.ts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../contexts/AuthContext.tsx";
import QRCode from "react-qr-code"; // Ezt a csomagot telepíteni kell: npm install react-qr-code

const ShopQRCode: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

 const { user } = useAuth();
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

  // QR kód tartalma - ez a bolt és a felhasználó azonosítóját tartalmazza
  const getQRCodeValue = () => {
    if (!shop || !user) return "";
    
    const qrData = {
      shopId: shop.id,
      userId: user.id,
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(qrData);
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
                Vissza
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
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1">
              QR Kód: {shop.name}
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            Mutassa be ezt a QR kódot a bolt munkatársának a vásárlás után a pontok jóváírásához.
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* QR kód megjelenítése */}
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              my: 4,
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <QRCode
              size={256}
              value={getQRCodeValue()}
              viewBox={`0 0 256 256`}
            />
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 2, textAlign: "center" }}
          >
            Ez a QR kód az Ön egyedi azonosítóját tartalmazza, és csak a következő bolt fogadja el:
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ textAlign: "center", mt: 1 }}
          >
            {shop.name}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleGoBack}
            >
              Vissza a bolt részleteihez
            </Button>
          </Box>
        </Box>
      </Paper>
    </ProtectedLayout>
  );
};

export default ShopQRCode;