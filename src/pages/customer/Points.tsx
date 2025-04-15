// src/pages/customer/Points.tsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import ProtectedLayout from "../../components/common/ProtectedLayout.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import PointsService from "../../services/points.service.ts";
import { UserPoints } from "../../types/shop.types.ts";
import PointsCard from "../../components/customer/PointsCard.tsx";
import { ShopService } from "../../services/shop.service.ts";
import { useLocation } from "react-router-dom";
import TransactionsList from "../../components/customer/TransactionsList.tsx";
import PointsSummary from '../../components/customer/PointsSummary.tsx';
import PointsHistory from '../../components/customer/PointsHistory.tsx';
// Tab panel komponens
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CustomerPoints: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<UserPoints[]>([]);
  const [shopNames, setShopNames] = useState<{ [key: string]: string }>({});
  const [shopLogos, setShopLogos] = useState<{ [key: string]: string }>({});
  const [tabValue, setTabValue] = useState(0);
  const [totalShops, setTotalShops] = useState(0);
  // URL paraméterekből kinyerjük a shopId-t, ha van
  const queryParams = new URLSearchParams(location.search);
  const selectedShopId = queryParams.get("shopId");

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const points = await PointsService.getAllUserPoints(user.id);
        setUserPoints(points);
        
        // Boltok adatainak lekérése a pontokhoz
        const shopIds = points.map(p => p.shopId);
        await fetchShopDetails(shopIds);
        
        // Összes elérhető bolt számának lekérése
        const shopsResponse = await ShopService.getShops();
        setTotalShops(shopsResponse.total);
        
        setError(null);
      } catch (err) {
        console.error("Hiba a pontok betöltésekor:", err);
        setError("Nem sikerült betölteni a pontokat. Kérjük, próbálja újra később.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserPoints();
  }, [user]);

  // Boltok nevének és logójának lekérése
  const fetchShopDetails = async (shopIds: string[]) => {
    try {
      const shopNamesObj: { [key: string]: string } = {};
      const shopLogosObj: { [key: string]: string } = {};

      // Minden bolt adatainak lekérése
      for (const shopId of shopIds) {
        const shopData = await ShopService.getShopById(shopId);
        shopNamesObj[shopId] = shopData.name;
        shopLogosObj[shopId] = shopData.logo || "";
      }

      setShopNames(shopNamesObj);
      setShopLogos(shopLogosObj);
    } catch (error) {
      console.error("Hiba a boltok adatainak lekérésekor:", error);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </ProtectedLayout>
    );
  }

  if (error) {
    return (
      <ProtectedLayout>
        <Alert severity="error" sx={{ mt: 2, mb: 4 }}>
          {error}
        </Alert>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
  <Paper elevation={3}>
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Összegyűjtött Pontok
      </Typography>

      <Typography variant="body1" paragraph>
        Itt láthatja az összes összegyűjtött hűségpontját boltonként.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label="Pontjaim"
            id="simple-tab-0"
            aria-controls="simple-tabpanel-0"
          />
          <Tab
            label="Tranzakciók"
            id="simple-tab-1"
            aria-controls="simple-tabpanel-1"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
            {/* Pontok összegzése */}
            <PointsSummary allPoints={userPoints} totalShops={totalShops} />
            
            {/* Pont történet hozzáadása */}
            {user && (
              <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <PointsHistory 
                  userId={user.id} 
                  shopId={selectedShopId || undefined} 
                  limit={5}
                />
              </Paper>
            )}
            
            {userPoints.length === 0 ? (
              <Box textAlign="center" my={4}>
                <Typography variant="h6" color="text.secondary">
                  Még nincsenek összegyűjtött pontjai.
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Látogasson el a boltokhoz és vásároljon a pontok gyűjtéséhez.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 3 }}>
                {userPoints.map((pointsData) => (
                  <Box 
                    key={pointsData.shopId} 
                    sx={{ 
                      width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' },
                      mb: 2 
                    }}
                  >
                    <PointsCard 
                      points={pointsData} 
                      shopName={shopNames[pointsData.shopId] || 'Ismeretlen bolt'} 
                      shopLogo={shopLogos[pointsData.shopId]}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {selectedShopId ? (
          // Ha van kiválasztott bolt, akkor csak annak a tranzakcióit mutatjuk
          <TransactionsList
            userId={user?.id || ""}
            shopId={selectedShopId}
          />
        ) : (
          // Ha nincs kiválasztott bolt, akkor az összes tranzakciót mutatjuk
          <TransactionsList userId={user?.id || ""} />
        )}
      </TabPanel>
    </Box>
  </Paper>
</ProtectedLayout>
  );
};

export default CustomerPoints;
