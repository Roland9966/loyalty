// src/pages/customer/Profile.tsx módosított verzió Grid nélkül, profilkép feltöltéssel
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  PhotoCamera,
  Save,
  Cancel,
} from "@mui/icons-material";
import ProtectedLayout from "../../components/common/ProtectedLayout.tsx";
import FormInput from "../../components/common/FormInput.tsx";
import SubmitButton from "../../components/common/SubmitButton.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import authService, { User } from "../../services/auth.service.ts";

interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
  notifications: boolean;
  publicProfile: boolean;
  profileImage?: string; // Új: profilkép URL-je
}

const CustomerProfile: React.FC = () => {
  const { user, updateUser, uploadProfilePicture, getUserProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    notifications: true,
    publicProfile: false,
    profileImage: "", // Új: profilkép URL-je
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // Új: kép feltöltési állapot
  const [editField, setEditField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Felhasználói adatok betöltése
  useEffect(() => {
    if (user) {
      // Teljes profil betöltése az API-ról
      const loadUserProfile = async () => {
        try {
          setIsLoading(true);
          const userProfile = await getUserProfile(user.id);

          // Ha a userProfile nem null, akkor használjuk az adatait
          if (userProfile) {
            setFormData({
              name: userProfile.name || user.name || "",
              email: userProfile.email || user.email || "",
              phoneNumber: userProfile.phoneNumber || "+36701234567",
              notifications: userProfile.notifications || true,
              publicProfile: userProfile.publicProfile || false,
              profileImage: userProfile.profileImage || "", // Profilkép URL
            });

            // Ha van profilkép, beállítjuk
            if (userProfile.profileImage) {
              setPreviewUrl(userProfile.profileImage);
            }
          } else {
            // Ha nincs userProfile, fallback a user objektumra
            setFormData({
              name: user.name || "",
              email: user.email || "",
              phoneNumber: "+36701234567", // Minta adat
              notifications: true,
              publicProfile: false,
              profileImage: user.profileImage || "", // Profilkép URL
            });

            // Ha van profilkép a felhasználónál, beállítjuk
            if (user.profileImage) {
              setPreviewUrl(user.profileImage);
            }
          }
        } catch (error) {
          console.error("Hiba a felhasználói profil betöltése során:", error);
          setNotification({
            open: true,
            message: "Nem sikerült betölteni a profil adatokat",
            severity: "error",
          });

          // Fallback adatok
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phoneNumber: "+36701234567",
            notifications: true,
            publicProfile: false,
            profileImage: user.profileImage || "",
          });

          if (user.profileImage) {
            setPreviewUrl(user.profileImage);
          }
        } finally {
          setIsLoading(false);
        }
      };

      loadUserProfile();
    }
  }, [user, getUserProfile]);

  // Profilkép előnézet
  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else if (formData.profileImage) {
      // Ha nincs kiválasztott fájl, de van már mentett profilkép, azt használjuk
      setPreviewUrl(formData.profileImage);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile, formData.profileImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (editField) {
      setTempValue(type === "checkbox" ? checked.toString() : value);
    }

    // Töröljük a mezőhöz tartozó hibát, ha van
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const startEditing = (field: string) => {
    setEditField(field);
    setTempValue(formData[field as keyof ProfileFormData]?.toString() || "");
  };

  const cancelEditing = () => {
    setEditField(null);
    setTempValue("");
  };

  const saveField = async (field: string) => {
    // Alapvető validáció
    if (field === "email" && tempValue && !/\S+@\S+\.\S+/.test(tempValue)) {
      setErrors({ email: "Érvénytelen e-mail cím" });
      return;
    }

    if ((field === "name" || field === "email") && !tempValue.trim()) {
      setErrors({ [field]: "Ez a mező nem lehet üres" });
      return;
    }

    setIsLoading(true);

    try {
      if (!user || !user.id) {
        throw new Error("Nincs bejelentkezett felhasználó");
      }

      // Felhasználói adatok frissítése - csak a User típusban meglévő mezőkkel
      const updatedUserData: Partial<User> = {};

      // Ellenőrizzük, hogy a mező a name vagy email mező-e
      if (field === "name") {
        updatedUserData.name = tempValue;
      } else if (field === "email") {
        updatedUserData.email = tempValue;
      } else if (field === "phoneNumber") {
        // A phoneNumber nem része a User interfésznek, de talán a backend-en kezelik
        // Ezt a részt a backend API-tól függően kell implementálni
        console.log(
          `A ${field} mező frissítéséhez külön API végpont szükséges`
        );
      }

      // API hívás a backend felé - csak ha van mit frissíteni
      if (Object.keys(updatedUserData).length > 0) {
        const success = await authService.updateUserProfile(
          user.id,
          updatedUserData
        );

        if (!success) {
          throw new Error("Nem sikerült frissíteni a felhasználói adatokat");
        }

        // Auth kontextus frissítése - csak a User típusban meglévő mezőkkel
        updateUser({
          ...user,
          ...updatedUserData,
        });
      }

      // Mező frissítése a formData-ban (ez mindig megtörténik, függetlenül attól, hogy a backend-et frissítettük-e)
      setFormData((prev) => ({ ...prev, [field]: tempValue }));

      setNotification({
        open: true,
        message: "A mező sikeresen frissítve!",
        severity: "success",
      });

      setEditField(null);
    } catch (error) {
      console.error("Hiba a mező mentése során:", error);
      setNotification({
        open: true,
        message:
          "Hiba történt a mező mentése során: " +
          (error instanceof Error ? error.message : "Ismeretlen hiba"),
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "A név megadása kötelező";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Az e-mail cím megadása kötelező";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Érvénytelen e-mail cím";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB méretkorlátozás
        setNotification({
          open: true,
          message: "A fájl túl nagy! Maximum 5MB engedélyezett.",
          severity: "error",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedFile || !user?.id) return;
  
    setUploadingImage(true);
  
    try {
      // AuthContext-en keresztül töltjük fel a képet
      const response = await uploadProfilePicture(user.id, selectedFile);
      
      console.log("Profilkép feltöltés válasz:", response); // Debug log
  
      if (!response || !response.imageUrl) {
        throw new Error("Nem sikerült feltölteni a profilképet");
      }
  
      console.log("Kapott kép URL:", response.imageUrl); // Debug
      
      // Frissítjük a formData-t az új képpel
      setFormData((prev) => ({
        ...prev,
        profileImage: response.imageUrl,
      }));
      
      // Explicit previewUrl beállítás - fontos!
      setPreviewUrl(response.imageUrl);
  
      setNotification({
        open: true,
        message: "A profilkép sikeresen frissítve!",
        severity: "success",
      });
  
      // Töröljük a selectedFile-t, mivel már feltöltöttük
      setSelectedFile(null);
      
      // Késleltetett previewUrl beállítás, ha az azonnali nem működne
      setTimeout(() => {
        setPreviewUrl(response.imageUrl);
        console.log("Késleltetett previewUrl beállítás:", response.imageUrl);
      }, 500);
      
    } catch (error) {
      console.error("Hiba a profilkép feltöltése során:", error);
      setNotification({
        open: true,
        message:
          "Hiba történt a profilkép feltöltése során: " +
          (error instanceof Error ? error.message : "Ismeretlen hiba"),
        severity: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user?.id) {
      return;
    }

    setIsLoading(true);

    try {
      // Teljes profil frissítése - csak a User interfészben szereplő mezőket küldjük
      const userData: Partial<User> = {
        name: formData.name,
        email: formData.email,
        // A phoneNumber, notifications, publicProfile nem része a User interfésznek,
        // ezért ezeket másként kell kezelni, vagy ki kell bővíteni az API-t
      };

      const success = await authService.updateUserProfile(user.id, userData);

      if (!success) {
        throw new Error("Nem sikerült frissíteni a profilt");
      }

      // Frissítjük a felhasználói kontextust
      updateUser({
        ...user,
        name: formData.name,
        email: formData.email,
      });

      setNotification({
        open: true,
        message: "A profil sikeresen frissítve!",
        severity: "success",
      });
    } catch (error) {
      console.error("Hiba a profil mentése során:", error);
      setNotification({
        open: true,
        message:
          "Hiba történt a profil mentése során: " +
          (error instanceof Error ? error.message : "Ismeretlen hiba"),
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <ProtectedLayout>
      <Container maxWidth="md">
        <Box py={4}>
          <Paper elevation={3}>
            <Box p={3}>
              <Box display="flex" alignItems="center" mb={3}>
                <Box position="relative">
                  <Avatar
                    sx={{ width: 100, height: 100, mr: 3 }}
                    src={previewUrl || undefined}
                  >
                    {!previewUrl &&
                      (user?.name ? user.name.charAt(0).toUpperCase() : "V")}
                  </Avatar>
                  <Box position="absolute" bottom={-5} right={15}>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="icon-button-file"
                      type="file"
                      onChange={handleFileChange}
                      disabled={uploadingImage}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        component="span"
                        color="primary"
                        sx={{ backgroundColor: "white", boxShadow: 1 }}
                        disabled={uploadingImage}
                      >
                        <PhotoCamera fontSize="small" />
                      </IconButton>
                    </label>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {formData.name || "Felhasználó"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Itt kezelheti személyes adatait
                  </Typography>
                  {selectedFile && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={handleUploadProfilePicture}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <Box display="flex" alignItems="center">
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Feltöltés...
                        </Box>
                      ) : (
                        "Profilkép mentése"
                      )}
                    </Button>
                  )}
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {isLoading && !editField ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  {/* Név mező */}
                  <Box mb={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flexGrow={1} mr={2}>
                        {editField === "name" ? (
                          <FormInput
                            name="name"
                            label="Teljes név"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            error={errors.name}
                            autoFocus
                            required
                          />
                        ) : (
                          <Typography variant="body1">
                            <strong>Név:</strong> {formData.name}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {editField === "name" ? (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => saveField("name")}
                              disabled={isLoading}
                            >
                              <Save />
                            </IconButton>
                            <IconButton color="default" onClick={cancelEditing}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            color="primary"
                            onClick={() => startEditing("name")}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Email mező */}
                  <Box mb={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flexGrow={1} mr={2}>
                        {editField === "email" ? (
                          <FormInput
                            name="email"
                            label="E-mail cím"
                            type="email"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            error={errors.email}
                            autoFocus
                            required
                          />
                        ) : (
                          <Typography variant="body1">
                            <strong>E-mail:</strong> {formData.email}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {editField === "email" ? (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => saveField("email")}
                              disabled={isLoading}
                            >
                              <Save />
                            </IconButton>
                            <IconButton color="default" onClick={cancelEditing}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            color="primary"
                            onClick={() => startEditing("email")}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Telefonszám mező */}
                  <Box mb={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flexGrow={1} mr={2}>
                        {editField === "phoneNumber" ? (
                          <FormInput
                            name="phoneNumber"
                            label="Telefonszám"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            error={errors.phoneNumber}
                            autoFocus
                          />
                        ) : (
                          <Typography variant="body1">
                            <strong>Telefonszám:</strong>{" "}
                            {formData.phoneNumber || "Nincs megadva"}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {editField === "phoneNumber" ? (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => saveField("phoneNumber")}
                              disabled={isLoading}
                            >
                              <Save />
                            </IconButton>
                            <IconButton color="default" onClick={cancelEditing}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            color="primary"
                            onClick={() => startEditing("phoneNumber")}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Beállítások szekció */}
                  <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                      Beállítások
                    </Typography>

                    <Box mb={2}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.notifications}
                              onChange={handleChange}
                              name="notifications"
                              color="primary"
                            />
                          }
                          label="E-mail értesítések engedélyezése"
                        />
                        <Tooltip title="Engedélyezés esetén e-mail értesítéseket küldünk az új akciókról és ajánlatokról.">
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box mb={2}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.publicProfile}
                              onChange={handleChange}
                              name="publicProfile"
                              color="primary"
                            />
                          }
                          label="Nyilvános profil"
                        />
                        <Tooltip title="Engedélyezés esetén a profilod látható lesz más felhasználók számára.">
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>

                  <Box mt={3} display="flex" justifyContent="center">
                    <SubmitButton
                      loading={isLoading && !editField}
                      sx={{ width: "50%", py: 1.5 }}
                    >
                      Összes beállítás mentése
                    </SubmitButton>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>

          <Box mt={4}>
            <Paper elevation={3}>
              <Box p={3}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Jelszó módosítása
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Itt megváltoztathatja fiókja jelszavát.
                </Typography>
                <Button
                  variant="outlined"
                  component="a"
                  href="/customer/change-password"
                  fullWidth
                  sx={{ py: 1 }}
                >
                  Jelszó módosítása
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ProtectedLayout>
  );
};

export default CustomerProfile;
