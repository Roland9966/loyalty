// src/components/customer/PointsHistory.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import StarIcon from "@mui/icons-material/Star";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { Transaction } from "../../types/shop.types.ts";
import PointsService from "../../services/points.service.ts";
import { ShopService } from "../../services/shop.service.ts";

interface PointsHistoryProps {
  userId: string;
  shopId?: string;
  limit?: number;
}

const PointsHistory: React.FC<PointsHistoryProps> = ({
  userId,
  shopId,
  limit = 5,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shopNames, setShopNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        // Lekérjük a legutóbbi tranzakciókat
        let result;
        if (shopId) {
          result = await PointsService.getUserTransactionsForShop(
            userId,
            shopId,
            1,
            limit
          );
        } else {
          result = await PointsService.getAllUserTransactions(userId, 1, limit);
        }

        setTransactions(result.transactions);

        // Boltok neveinek lekérése
        if (!shopId && result.transactions.length > 0) {
          // Szűrjük ki a nem string típusú shopId-kat
          const uniqueShopIds: string[] = [];

          // Explicit típusellenőrzés és szűrés
          result.transactions.forEach((t) => {
            if (typeof t.shopId === "string" && t.shopId) {
              if (!uniqueShopIds.includes(t.shopId)) {
                uniqueShopIds.push(t.shopId);
              }
            }
          });

          if (uniqueShopIds.length > 0) {
            fetchShopNames(uniqueShopIds);
          }
        } else if (shopId) {
          const shop = await ShopService.getShopById(shopId);
          setShopNames({ [shopId]: shop.name });
        }
      } catch (err) {
        console.error("Hiba a tranzakciók lekérésekor:", err);
        setError("Nem sikerült betölteni a pont történetet.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId, shopId, limit]);

  // Boltok neveinek lekérése
  const fetchShopNames = async (shopIds: string[]) => {
    try {
      const shopNamesObj: { [key: string]: string } = {};

      for (const id of shopIds) {
        const shop = await ShopService.getShopById(id);
        shopNamesObj[id] = shop.name;
      }

      setShopNames(shopNamesObj);
    } catch (error) {
      console.error("Hiba a bolt nevek lekérésekor:", error);
    }
  };

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

  if (transactions.length === 0) {
    return (
      <Box textAlign="center" my={2}>
        <Typography variant="body1" color="text.secondary">
          Még nincsenek pont tranzakciók.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {shopId
          ? `Pont történet: ${shopNames[shopId] || "Betöltés..."}`
          : "Legutóbbi pont változások"}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Timeline position="alternate">
        {transactions.map((transaction, index) => {
          const date = new Date(transaction.date);
          const shopName =
            typeof transaction.shopId === "string"
              ? shopNames[transaction.shopId] || "Ismeretlen bolt"
              : "Ismeretlen bolt";

          return (
            <TimelineItem key={transaction.id}>
              <TimelineOppositeContent color="text.secondary">
                {date.toLocaleDateString("hu-HU", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                <Typography variant="caption" display="block">
                  {date.toLocaleTimeString("hu-HU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot color="primary">
                  <StarIcon />
                </TimelineDot>
                {index < transactions.length - 1 && <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocalMallIcon
                      sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="body2">{shopName}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {transaction.amount.toLocaleString("hu-HU")} Ft
                    </Typography>
                    <Chip
                      label={`+${transaction.pointsEarned} pont`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
};

export default PointsHistory;
