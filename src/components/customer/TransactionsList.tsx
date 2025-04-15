// src/components/customer/TransactionsList.tsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
  Alert,
} from "@mui/material";
import { Transaction } from "../../types/shop.types.ts";
import PointsService from "../../services/points.service.ts";
import { ShopService } from "../../services/shop.service.ts";

interface TransactionsListProps {
  userId: string;
  shopId?: string;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  userId,
  shopId,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [shopNames, setShopNames] = useState<{ [key: string]: string }>({});

  // Tranzakciók lekérése
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        // Ha van specifikus bolt megadva, akkor csak annak a tranzakcióit kérjük le
        let result;
        if (shopId) {
          result = await PointsService.getUserTransactionsForShop(
            userId,
            shopId,
            page + 1,
            rowsPerPage
          );
        } else {
          // Különben az összes tranzakciót lekérjük
          result = await PointsService.getAllUserTransactions(
            userId,
            page + 1,
            rowsPerPage
          );
        }

        setTransactions(result.transactions);
        setTotalTransactions(result.total);

        // Boltok neveinek lekérése
        if (!shopId) {
            // Explicit típus konverzió és szűrés egy lépésben
            const uniqueShopIds: string[] = [];
            
            // Először gyűjtsük össze az összes shopId-t, ami string típusú
            result.transactions.forEach(t => {
              if (typeof t.shopId === 'string' && t.shopId) {
                if (!uniqueShopIds.includes(t.shopId)) {
                  uniqueShopIds.push(t.shopId);
                }
              }
            });
            
            if (uniqueShopIds.length > 0) {
              fetchShopNames(uniqueShopIds);
            }
          } else {
          // Ha csak egy bolt van, akkor annak a nevét kérjük le
          const shop = await ShopService.getShopById(shopId);
          setShopNames({ [shopId]: shop.name });
        }

        setError(null);
      } catch (err) {
        console.error("Hiba a tranzakciók betöltésekor:", err);
        setError(
          "Nem sikerült betölteni a tranzakciókat. Kérjük, próbálja újra később."
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId, shopId, page, rowsPerPage]);

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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 4 }}>
        {error}
      </Alert>
    );
  }

  if (transactions.length === 0) {
    return (
      <Box textAlign="center" my={4}>
        <Typography variant="h6" color="text.secondary">
          Nincsenek még tranzakciók.
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Látogasson el a boltokhoz és vásároljon a pontok gyűjtéséhez.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {shopId
          ? `Tranzakciók a következő boltban: ${
              shopNames[shopId] || "Betöltés..."
            }`
          : "Összes tranzakció"}
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Dátum</TableCell>
              {!shopId && <TableCell>Bolt</TableCell>}
              <TableCell align="right">Összeg (Ft)</TableCell>
              <TableCell align="right">Szerzett pontok</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString("hu-HU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                {!shopId && (
                  <TableCell>
                    {typeof transaction.shopId === 'string' && shopNames[transaction.shopId] 
                      ? shopNames[transaction.shopId] 
                      : "Ismeretlen bolt"}
                  </TableCell>
                )}
                <TableCell align="right">
                  {transaction.amount.toLocaleString("hu-HU")} Ft
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={`+${transaction.pointsEarned} pont`}
                    color="primary"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalTransactions}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Sorok száma:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} / ${count !== -1 ? count : `több mint ${to}`}`
        }
      />
    </Box>
  );
};

export default TransactionsList;