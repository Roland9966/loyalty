// src/pages/shop/Home.tsx
import React from "react";
import {
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import ProtectedLayout from "../../components/common/ProtectedLayout.tsx";
import { usePermission } from "../../hooks/usePermission.ts";
//import PermissionGate from "../../components/common/PermissionGate.tsx";

const ShopHome: React.FC = () => {
  const { check } = usePermission();

  // Ellenőrizzük a jogosultságokat
  const canManageEmployees = check("manage_employees");
  const canUpdateShop = check("update_shop");
  return (
    <ProtectedLayout>
      <Paper elevation={3}>
        <Box p={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bolti kezelőfelület
          </Typography>

          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
            {/* Minden boltkezelő láthatja */}
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    QR Kód olvasó
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Olvassa be a vásárló QR kódját a hűségpontok hozzáadásához.
                  </Typography>
                  <Button
                    variant="contained"
                    component="a"
                    href="/shop/scanner"
                  >
                    QR Olvasóhoz
                  </Button>
                </CardContent>
              </Card>
            </Box>

            {/* Minden boltkezelő láthatja */}
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tranzakciók
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Tranzakciók kezelése és áttekintése.
                  </Typography>
                  <Button
                    variant="contained"
                    component="a"
                    href="/shop/transactions"
                  >
                    Tranzakciókhoz
                  </Button>
                </CardContent>
              </Card>
            </Box>

            {/* Csak admin láthatja */}
            {canManageEmployees && (
              <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Alkalmazottak kezelése
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Alkalmazottak hozzáadása, szerkesztése vagy törlése.
                    </Typography>
                    <Button
                      variant="contained"
                      component="a"
                      href="/shop/employees"
                    >
                      Alkalmazottak kezeléséhez
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Csak admin láthatja */}
            {canUpdateShop && (
              <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Bolt beállítások
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Bolt adatok és beállítások szerkesztése.
                    </Typography>
                    <Button
                      variant="contained"
                      component="a"
                      href="/shop/profile"
                    >
                      Beállításokhoz
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </ProtectedLayout>
  );
};

export default ShopHome;
