// src/components/customer/ShopPointsSummary.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
 
  Divider,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PointsService from "../../services/points.service.ts";
import { UserPoints } from "../../types/shop.types.ts";

interface ShopPointsSummaryProps {
  userId: string;
  shopId: string;
}

const ShopPointsSummary: React.FC<ShopPointsSummaryProps> = ({
  userId,
  shopId,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<UserPoints | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true);
        const pointsData = await PointsService.getUserPointsForShop(
          userId,
          shopId
        );
        setPoints(pointsData);
        setError(null);
      } catch (err) {
        console.error("Hiba a pontok lekérésekor:", err);
        setError("Nem sikerült betölteni a pontadatokat.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && shopId) {
      fetchPoints();
    }
  }, [userId, shopId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!points) {
    return (
      <Box textAlign="center" my={2}>
        <Typography variant="body1" color="text.secondary">
          Nincs még pont ebben a boltban.
        </Typography>
      </Box>
    );
  }

  // Következő jutalom szinthez hány pont kell még
  const nextRewardThreshold = Math.ceil(points.currentPoints / 100) * 100;
  const progressToNextReward =
    (points.currentPoints / nextRewardThreshold) * 100;
  const pointsToNextReward = nextRewardThreshold - points.currentPoints;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 3,
          p: 2,
          bgcolor: "primary.light",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "flex-start" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <StarIcon sx={{ fontSize: 32, color: "primary.main" }} />
          </Box>
          <Box>
            <Typography
              variant="h3"
              component="div"
              color="white"
              fontWeight="bold"
            >
              {points.currentPoints}
            </Typography>
            <Typography variant="body2" color="white">
              jelenlegi pont
            </Typography>
          </Box>
        </Box>

        <Divider
          orientation={window.innerWidth < 600 ? "horizontal" : "vertical"}
          flexItem
          sx={{
            bgcolor: "white",
            opacity: 0.5,
            display: { xs: "none", sm: "block" },
          }}
        />

        <Box
          sx={{
            flex: 1,
            width: { xs: "100%", sm: "auto" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography variant="body1" color="white">
            Összesen eddig gyűjtött:{" "}
            <strong>{points.totalPointsEarned} pont</strong>
          </Typography>

          {points.lastTransaction && (
            <Typography variant="body2" color="white" sx={{ mt: 1 }}>
              Utolsó tranzakció:{" "}
              {new Date(points.lastTransaction).toLocaleDateString("hu-HU")}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2">Következő jutalom</Typography>
          <Typography variant="body2" fontWeight="bold">
            {points.currentPoints} / {nextRewardThreshold} pont
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressToNextReward}
          sx={{ height: 8, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Még {pointsToNextReward} pont szükséges a következő jutalomhoz
        </Typography>
      </Box>
    </Box>
  );
};

export default ShopPointsSummary;
