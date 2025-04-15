// src/components/customer/ShopCard.tsx
import React from "react";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Chip 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Shop } from "../../types/shop.types.ts";
import StorefrontIcon from "@mui/icons-material/Storefront";

interface ShopCardProps {
  shop: Shop;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/customer/shops/${shop.id}`);
  };

  return (
    <Card sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      transition: "transform 0.2s",
      "&:hover": {
        transform: "scale(1.02)",
        boxShadow: 3
      } 
    }}>
      {shop.logo ? (
        <CardMedia
          component="img"
          height="140"
          image={shop.logo}
          alt={shop.name}
        />
      ) : (
        <Box 
          sx={{ 
            height: 140, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            bgcolor: "primary.light" 
          }}
        >
          <StorefrontIcon sx={{ fontSize: 60, color: "white" }} />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {shop.name}
        </Typography>
        
        {shop.category && (
          <Chip 
            label={shop.category} 
            size="small" 
            sx={{ mb: 1 }} 
            color="primary"
            variant="outlined"
          />
        )}
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical"
          }}
        >
          {shop.description}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          <strong>Cím:</strong> {shop.address}
        </Typography>
        
        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
          <strong>Pontgyűjtés:</strong> {shop.pointsPerCurrency} pont / 100 Ft
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleViewDetails}
          size="medium"
        >
          Részletek
        </Button>
      </Box>
    </Card>
  );
};

export default ShopCard;