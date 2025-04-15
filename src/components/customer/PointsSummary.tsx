// src/components/customer/PointsSummary.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  
  Divider,
  LinearProgress
} from '@mui/material';
import { UserPoints } from '../../types/shop.types.ts';
import StarsIcon from '@mui/icons-material/Stars';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StorefrontIcon from '@mui/icons-material/Storefront';

interface PointsSummaryProps {
  allPoints: UserPoints[];
  totalShops: number;
}

const PointsSummary: React.FC<PointsSummaryProps> = ({ allPoints, totalShops }) => {
  // Összes jelenlegi pont kiszámítása
  const totalCurrentPoints = allPoints.reduce(
    (sum, point) => sum + point.currentPoints,
    0
  );
  
  // Valaha gyűjtött összes pont
  const totalEarnedPoints = allPoints.reduce(
    (sum, point) => sum + point.totalPointsEarned,
    0
  );
  
  // Legutolsó tranzakció meghatározása
  const getLastTransaction = () => {
    let lastDate = new Date(0); // 1970-01-01
    let lastTransactionShop = '';
    
    allPoints.forEach(point => {
      if (point.lastTransaction) {
        const transactionDate = new Date(point.lastTransaction);
        if (transactionDate > lastDate) {
          lastDate = transactionDate;
          lastTransactionShop = point.shopId; // Ideális esetben itt a bolt nevét használnánk
        }
      }
    });
    
    if (lastDate.getTime() === 0) return null;
    
    return {
      date: lastDate,
      shopId: lastTransactionShop
    };
  };
  
  const lastTransaction = getLastTransaction();
  
  // Céljutalom kiszámítása (ez csak egy példa)
  const targetPoints = Math.ceil(totalCurrentPoints / 500) * 500;
  const progress = Math.min((totalCurrentPoints / targetPoints) * 100, 100);
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
    <Typography variant="h5" gutterBottom>
      Pontjaim összegzése
    </Typography>
    
    <Divider sx={{ my: 2 }} />
    
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' }, 
      gap: 3, 
      justifyContent: 'space-between' 
    }}>
      {/* Összes pont */}
      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        mb: { xs: 2, md: 0 }
      }}>
        <Box sx={{ 
          bgcolor: 'primary.light', 
          borderRadius: '50%', 
          width: 80, 
          height: 80, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 1
        }}>
          <StarsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>
        <Typography variant="h4" color="primary" fontWeight="bold">
          {totalCurrentPoints}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Jelenlegi pontok
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Összes gyűjtött: {totalEarnedPoints}
        </Typography>
      </Box>
      
      {/* Boltok száma */}
      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        mb: { xs: 2, md: 0 }
      }}>
        <Box sx={{ 
          bgcolor: 'info.light', 
          borderRadius: '50%', 
          width: 80, 
          height: 80, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 1
        }}>
          <StorefrontIcon sx={{ fontSize: 40, color: 'info.main' }} />
        </Box>
        <Typography variant="h4" color="info.main" fontWeight="bold">
          {allPoints.length}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bolt ahol pontot gyűjtött
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Összes elérhető bolt: {totalShops}
        </Typography>
      </Box>
      
      {/* Utolsó tranzakció */}
      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center' 
      }}>
        <Box sx={{ 
          bgcolor: 'success.light', 
          borderRadius: '50%', 
          width: 80, 
          height: 80, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 1
        }}>
          <ReceiptIcon sx={{ fontSize: 40, color: 'success.main' }} />
        </Box>
        {lastTransaction ? (
          <>
            <Typography variant="body1" fontWeight="medium">
              {lastTransaction.date.toLocaleDateString('hu-HU', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Legutóbbi tranzakció időpontja
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1" fontWeight="medium">
              Nincs még tranzakció
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Látogasson el a boltokba és gyűjtsön pontokat
            </Typography>
          </>
        )}
      </Box>
    </Box>
    
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">Előrehaladás a következő jutalomig</Typography>
        <Typography variant="body2" fontWeight="bold">
          {totalCurrentPoints} / {targetPoints} pont
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ height: 10, borderRadius: 5 }} 
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
        Még {targetPoints - totalCurrentPoints} pont szükséges a következő jutalomhoz
      </Typography>
    </Box>
  </Paper>
  );
};

export default PointsSummary;