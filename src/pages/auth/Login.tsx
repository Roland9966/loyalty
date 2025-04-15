// src/pages/auth/Login.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Link,
  Divider,
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import FormInput from "../../components/common/FormInput.tsx";
import SubmitButton from "../../components/common/SubmitButton.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";

interface LocationState {
  message?: string;
  from?: string;
}

const Login: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const message = state?.message;
  const from = state?.from || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(message ? { type: "success", text: message } : null);

  // Csak egyszer ellenőrizzük induláskor, ha már be van jelentkezve
  useEffect(() => {
    // Ha a felhasználó már be van jelentkezve, és a login oldalra próbál navigálni,
    // átirányítjuk a megfelelő oldalra
    if (isAuthenticated && user && location.pathname === "/login") {
      if (user.role === "customer") {
        navigate("/customer", { replace: true });
      } else if (user.role === "shop_admin" || user.role === "shop_employee") {
        navigate("/shop", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, []); // Üres függőségi tömb, csak egyszer fut le

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Törli a hibát, amikor a felhasználó szerkeszti a mezőt
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Az e-mail cím megadása kötelező";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Érvénytelen e-mail cím";
    }

    if (!formData.password) {
      newErrors.password = "A jelszó megadása kötelező";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        setStatusMessage({ type: "success", text: "Sikeres bejelentkezés!" });

        // Használd a már meglévő 'user' állapotot a navigációhoz
        setTimeout(() => {
          if (user) {
            if (user.role === "customer") {
              navigate("/customer", { replace: true });
            } else if (
              user.role === "shop_admin" ||
              user.role === "shop_employee"
            ) {
              navigate("/shop", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          } else {
            navigate("/", { replace: true });
          }
        }, 1000);
      } else {
        setStatusMessage({
          type: "error",
          text: "Hibás e-mail cím vagy jelszó.",
        });
      }
    } catch (error) {
      // ...
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box py={4}>
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Bejelentkezés
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              paragraph
            >
              Jelentkezzen be a fiókjába
            </Typography>

            <Divider sx={{ my: 2 }} />

            {statusMessage && (
              <Alert
                severity={statusMessage.type}
                sx={{ mb: 2 }}
                onClose={() => setStatusMessage(null)}
              >
                {statusMessage.text}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <FormInput
                name="email"
                label="E-mail cím"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                autoFocus
              />

              <FormInput
                name="password"
                label="Jelszó"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />

              <Box mt={3}>
                <SubmitButton loading={isSubmitting}>
                  Bejelentkezés
                </SubmitButton>
              </Box>

              <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  Nincs még fiókja?{" "}
                  <Link component={RouterLink} to="/register/customer">
                    Vásárlói regisztráció
                  </Link>
                  {" vagy "}
                  <Link component={RouterLink} to="/register/shop">
                    Bolt regisztráció
                  </Link>
                </Typography>
              </Box>

              <Box mt={1} textAlign="center">
                <Typography variant="body2">
                  <Link component={RouterLink} to="/forgot-password">
                    Elfelejtette jelszavát?
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
