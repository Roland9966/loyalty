// src/components/customer/PointsCard.tsx
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 

  LinearProgress,
  Button,
  Divider
} from '@mui/material';
import { UserPoints } from '../../types/shop.types.ts';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';

interface PointsCardProps {
  points: UserPoints;
  shopName: string;
  shopLogo?: string;
}

const PointsCard: React.FC<PointsCardProps> = ({ points, shopName, shopLogo }) => {
  const navigate = useNavigate();
  
  // Formázott dátum a legutóbbi tranzakcióhoz
  const formattedLastTransaction = points.lastTransaction 
    ? new Date(points.lastTransaction).toLocaleDateString('hu-HU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Nincs még tranzakció';
  
  // Következő jutalom szinthez hány pont kell még
  // Ez csak egy példa logika, ezt a valós követelményekhez kell igazítani
  const nextRewardThreshold = Math.ceil(points.currentPoints / 100) * 100;
  const progressToNextReward = (points.currentPoints / nextRewardThreshold) * 100;
  const pointsToNextReward = nextRewardThreshold - points.currentPoints;
  
  const handleViewDetails = () => {
    navigate(`/customer/shops/${points.shopId}`);
  };

  const handleViewTransactions = () => {
    navigate(`/customer/points?shopId=${points.shopId}`);
  };
  
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 3
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {shopLogo ? (
            <Box
              component="img"
              src={shopLogo}
              alt={shopName}
              sx={{ width: 40, height: 40, borderRadius: '50%', mr: 2 }}
            />
          ) : (
            <Box 
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                bgcolor: 'primary.main', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mr: 2
              }}
            >
              {shopName.charAt(0).toUpperCase()}
            </Box>
          )}
          <Typography variant="h6" component="div">
            {shopName}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1,
          p: 2, 
          bgcolor: 'primary.light', 
          borderRadius: 2 
        }}>
          <StarIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="div" color="primary" fontWeight="bold">
            {points.currentPoints}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            pont
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Összes gyűjtött pont: {points.totalPointsEarned}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Következő jutalom</Typography>
            <Typography variant="body2" fontWeight="bold">{nextRewardThreshold} pont</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progressToNextReward} 
            sx={{ height: 8, borderRadius: 5 }} 
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Még {pointsToNextReward} pont szükséges
          </Typography>
        </Box>
        
        {points.lastTransaction && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <ReceiptIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Utolsó tranzakció
              </Typography>
            </Box>
            <Typography variant="body2">
              {formattedLastTransaction}
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          size="small"
          onClick={handleViewDetails}
        >
          Bolt adatai
        </Button>
        <Button
          size="small"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={handleViewTransactions}
        >
          Tranzakciók
        </Button>
      </Box>
    </Card>
  );
};

export default PointsCard;