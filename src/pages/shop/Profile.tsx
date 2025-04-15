// src/pages/shop/Profile.tsx - továbbfejlesztett verzió
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
  Language,
  Notifications,
} from "@mui/icons-material";
import ProtectedLayout from "../../components/common/ProtectedLayout.tsx";
import FormInput from "../../components/common/FormInput.tsx";
import SubmitButton from "../../components/common/SubmitButton.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { usePermission } from "../../hooks/usePermission.ts";
import authService, { User } from "../../services/auth.service.ts";

interface ShopProfileFormData {
  shopName: string;
  adminName: string;
  email: string;
  address: string;
  phoneNumber: string;
  description: string;
  openingHours: string;
  website: string;
  notifications: boolean;
  publicListing: boolean;
  profileImage?: string;
}

const ShopProfile: React.FC = () => {
  //const { user } = useAuth();
  const { user, updateUser, uploadProfilePicture,getUserProfile } = useAuth();
  const [uploadingImage, setUploadingImage] = useState(false);
  const { check } = usePermission();
  const canUpdateShop = check("update_shop");

  const [formData, setFormData] = useState<ShopProfileFormData>({
    shopName: "",
    adminName: "",
    email: "",
    address: "",
    phoneNumber: "",
    description: "",
    openingHours: "",
    profileImage: "", // Új mező
    website: "",
    notifications: true,
    publicListing: true,
  });

  const [isLoading, setIsLoading] = useState(false);
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

  // Bolt adatok betöltése
 // Bolt adatok betöltése
useEffect(() => {
  if (user) {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        // Betöltjük a felhasználó profilját
        const userProfile = await getUserProfile(user.id);
        
        // A profil adatok betöltése
        setFormData({
          shopName: "Minta Üzlet",
          adminName: user.name || "",
          email: user.email || "",
          address: "Budapest, Példa utca 1.",
          phoneNumber: "+36201234567",
          description: "Ez egy minta üzlet leírás, amely bemutatja a bolt profilját.",
          openingHours: "H-P: 9:00-18:00, Sz: 9:00-13:00, V: Zárva",
          website: "https://www.mintauzlet.hu",
          notifications: true,
          publicListing: true,
          profileImage: userProfile?.profileImage || user.profileImage || "" // Profilkép URL
        });
        
        // Profilkép beállítása
        if (userProfile?.profileImage || user.profileImage) {
          setPreviewUrl(userProfile?.profileImage || user.profileImage || null);
        }
      } catch (error) {
        console.error('Hiba a felhasználói profil betöltése során:', error);
        
        // Hiba esetén fallback adatok
        setFormData({
          shopName: "Minta Üzlet",
          adminName: user.name || "",
          email: user.email || "",
          address: "Budapest, Példa utca 1.",
          phoneNumber: "+36201234567",
          description: "Ez egy minta üzlet leírás, amely bemutatja a bolt profilját.",
          openingHours: "H-P: 9:00-18:00, Sz: 9:00-13:00, V: Zárva",
          website: "https://www.mintauzlet.hu",
          notifications: true,
          publicListing: true,
          profileImage: user.profileImage || "" // Fallback a user adataiból
        });
        
        // Fallback profilkép
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
    if (!canUpdateShop) return;

    setEditField(field);
    setTempValue(formData[field as keyof ShopProfileFormData]?.toString() || '');
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

    if (
      (field === "shopName" ||
        field === "adminName" ||
        field === "email" ||
        field === "address") &&
      !tempValue.trim()
    ) {
      setErrors({ [field]: "Ez a mező nem lehet üres" });
      return;
    }

    if (
      field === "website" &&
      tempValue &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
        tempValue
      )
    ) {
      setErrors({ website: "Érvénytelen weboldal URL" });
      return;
    }

    setIsLoading(true);

    try {
      // Felhasználói adatokat frissítjük
      if (field === "adminName" || field === "email") {
        if (!user || !user.id) {
          throw new Error("Nincs bejelentkezett felhasználó");
        }

        // Felhasználói adatok frissítése
        const updatedUserData: Partial<User> = {};
        if (field === "adminName") updatedUserData.name = tempValue;
        if (field === "email") updatedUserData.email = tempValue;

        // API hívás
        const success = await authService.updateUserProfile(
          user.id,
          updatedUserData
        );

        if (!success) {
          throw new Error("Nem sikerült frissíteni a felhasználói adatokat");
        }

        // Auth kontextus frissítése
        updateUser({
          id: user.id,
          name: field === "adminName" ? tempValue : user.name,
          email: field === "email" ? tempValue : user.email,
          role: user.role,
        });
      }
      // Bolt adatokat frissítjük
      else {
        // TODO: Bolt adatok frissítése API hívással
        // Például: await shopService.updateShop(shopId, { [field]: tempValue });

        // Ideiglenesen csak szimulálunk egy API hívást
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Helyi form állapot frissítése minden esetben
      setFormData((prev) => ({ ...prev, [field]: tempValue }));

      // Sikeres művelet jelzése
      setNotification({
        open: true,
        message: "A mező sikeresen frissítve!",
        severity: "success",
      });

      // Szerkesztési mód bezárása
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

    if (!formData.shopName.trim()) {
      newErrors.shopName = "Az üzlet nevének megadása kötelező";
    }

    if (!formData.adminName.trim()) {
      newErrors.adminName = "Az adminisztrátor nevének megadása kötelező";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Az e-mail cím megadása kötelező";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Érvénytelen e-mail cím";
    }

    if (!formData.address.trim()) {
      newErrors.address = "A cím megadása kötelező";
    }

    if (
      formData.website &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
        formData.website
      )
    ) {
      newErrors.website = "Érvénytelen weboldal URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUpdateShop) return;

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

  const uploadLogo = async () => {
    if (!selectedFile || !canUpdateShop || !user?.id) return;

    setUploadingImage(true);

    try {
      // Valódi API hívás a kép feltöltéséhez az AuthContext használatával
      console.log("Profilkép feltöltés megkezdése:", selectedFile.name);

      const response = await uploadProfilePicture(user.id, selectedFile);

      console.log("Profilkép feltöltés válasz:", response);

      if (!response || !response.imageUrl) {
        throw new Error("Nem sikerült feltölteni a logót");
      }

      // Frissítjük a formData-t az új képpel
      setFormData((prev) => ({
        ...prev,
        profileImage: response.imageUrl,
      }));

      // Explicit previewUrl beállítás
      setPreviewUrl(response.imageUrl);

      setNotification({
        open: true,
        message: "A logó sikeresen frissítve!",
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
      console.error("Hiba a logó feltöltése során:", error);
      setNotification({
        open: true,
        message:
          "Hiba történt a logó feltöltése során: " +
          (error instanceof Error ? error.message : "Ismeretlen hiba"),
        severity: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canUpdateShop) return;

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Itt normál esetben API-hívást tennénk a profil frissítéséhez
      // Most csak egy késleltetést szimulálunk
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setNotification({
        open: true,
        message: "A bolt adatai sikeresen frissítve!",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Hiba történt az adatok mentése során.",
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
                    sx={{
                      width: 100,
                      height: 100,
                      mr: 3,
                      bgcolor: "secondary.main",
                    }}
                    src={previewUrl || undefined}
                  >
                    {!previewUrl &&
                      (formData.shopName
                        ? formData.shopName.charAt(0).toUpperCase()
                        : "B")}
                  </Avatar>
                  {canUpdateShop && (
                    <Box position="absolute" bottom={-5} right={15}>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="icon-button-file"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="icon-button-file">
                        <IconButton
                          component="span"
                          color="primary"
                          sx={{ backgroundColor: "white", boxShadow: 1 }}
                        >
                          <PhotoCamera fontSize="small" />
                        </IconButton>
                      </label>
                    </Box>
                  )}
                </Box>

                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {formData.shopName || "Bolt"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Itt kezelheti boltja adatait és beállításait
                  </Typography>
                  {selectedFile && canUpdateShop && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={uploadLogo}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <Box display="flex" alignItems="center">
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Feltöltés...
                        </Box>
                      ) : (
                        "Logó mentése"
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
                  {/* Bolt neve mező */}
                  <Box mb={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flexGrow={1} mr={2}>
                        {editField === "shopName" ? (
                          <FormInput
                            name="shopName"
                            label="Bolt neve"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            error={errors.shopName}
                            autoFocus
                            required
                          />
                        ) : (
                          <Typography variant="body1">
                            <strong>Bolt neve:</strong> {formData.shopName}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {editField === "shopName" ? (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => saveField("shopName")}
                              disabled={isLoading}
                            >
                              <Save />
                            </IconButton>
                            <IconButton color="default" onClick={cancelEditing}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          canUpdateShop && (
                            <IconButton
                              color="primary"
                              onClick={() => startEditing("shopName")}
                            >
                              <EditIcon />
                            </IconButton>
                          )
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Adminisztrátor neve mező */}
                  <Box mb={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flexGrow={1} mr={2}>
                        {editField === "adminName" ? (
                          <FormInput
                            name="adminName"
                            label="Adminisztrátor neve"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            error={errors.adminName}
                            autoFocus
                            required
                          />
                        ) : (
                          <Typography variant="body1">
                            <strong>Adminisztrátor neve:</strong>{" "}
                            {formData.adminName}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {editField === "adminName" ? (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => saveField("adminName")}
                              disabled={isLoading}
                            >
                              <Save />
                            </IconButton>
                            <IconButton color="default" onClick={cancelEditing}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          canUpdateShop && (
                            <IconButton
                              color="primary"
                              onClick={() => startEditing("adminName")}
                            >
                              <EditIcon />
                            </IconButton>
                          )
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
                          canUpdateShop && (
                            <IconButton
                              color="primary"
                              onClick={() => startEditing("email")}
                            >
                              <EditIcon />
                            </IconButton>
                          )
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Cím mező */}
                  <Box mb={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flexGrow={1} mr={2}>
                        {editField === "address" ? (
                          <FormInput
                            name="address"
                            label="Bolt címe"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            error={errors.address}
                            autoFocus
                            required
                          />
                        ) : (
                          <Typography variant="body1">
                            <strong>Cím:</strong> {formData.address}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {editField === "address" ? (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => saveField("address")}
                              disabled={isLoading}
                            >
                              <Save />
                            </IconButton>
                            <IconButton color="default" onClick={cancelEditing}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          canUpdateShop && (
                            <IconButton
                              color="primary"
                              onClick={() => startEditing("address")}
                            >
                              <EditIcon />
                            </IconButton>
                          )
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
                          canUpdateShop && (
                            <IconButton
                              color="primary"
                              onClick={() => startEditing("phoneNumber")}
                            >
                              <EditIcon />
                            </IconButton>
                          )
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Nyitvatartás mező */}
                  <Box mb={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flexGrow={1} mr={2}>
                        {editField === "openingHours" ? (
                          <FormInput
                            name="openingHours"
                            label="Nyitvatartás"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            error={errors.openingHours}
                            autoFocus
                          />
                        ) : (
                          <Typography variant="body1">
                            <strong>Nyitvatartás:</strong>{" "}
                            {formData.openingHours || "Nincs megadva"}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {editField === "openingHours" ? (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => saveField("openingHours")}
                              disabled={isLoading}
                            >
                              <Save />
                            </IconButton>
                            <IconButton color="default" onClick={cancelEditing}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          canUpdateShop && (
                            <IconButton
                              color="primary"
                              onClick={() => startEditing("openingHours")}
                            >
                              <EditIcon />
                            </IconButton>
                          )
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Weboldal mező */}
                  <Box mb={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flexGrow={1} mr={2}>
                        {editField === "website" ? (
                          <FormInput
                            name="website"
                            label="Weboldal"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            error={errors.website}
                            autoFocus
                          />
                        ) : (
                          <Box display="flex" alignItems="center">
                            <Typography variant="body1" sx={{ mr: 1 }}>
                              <strong>Weboldal:</strong>
                            </Typography>
                            {formData.website ? (
                              <Button
                                startIcon={<Language />}
                                variant="text"
                                color="primary"
                                href={
                                  formData.website.startsWith("http")
                                    ? formData.website
                                    : `https://${formData.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {formData.website}
                              </Button>
                            ) : (
                              <Typography variant="body1">
                                Nincs megadva
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                      <Box>
                        {editField === "website" ? (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => saveField("website")}
                              disabled={isLoading}
                            >
                              <Save />
                            </IconButton>
                            <IconButton color="default" onClick={cancelEditing}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          canUpdateShop && (
                            <IconButton
                              color="primary"
                              onClick={() => startEditing("website")}
                            >
                              <EditIcon />
                            </IconButton>
                          )
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Bolt leírása mező */}
                  <Box mb={3}>
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      justifyContent="space-between"
                    >
                      <Box flexGrow={1} mr={2}>
                        {editField === "description" ? (
                          <FormInput
                            name="description"
                            label="Bolt leírása"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            error={errors.description}
                            autoFocus
                            multiline
                            rows={4}
                          />
                        ) : (
                          <Box>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Bolt leírása:</strong>
                            </Typography>
                            <Typography variant="body2">
                              {formData.description || "Nincs leírás megadva"}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Box>
                        {editField === "description" ? (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => saveField("description")}
                              disabled={isLoading}
                            >
                              <Save />
                            </IconButton>
                            <IconButton color="default" onClick={cancelEditing}>
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          canUpdateShop && (
                            <IconButton
                              color="primary"
                              onClick={() => startEditing("description")}
                            >
                              <EditIcon />
                            </IconButton>
                          )
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  {/* Beállítások szekció */}
                  {canUpdateShop && (
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
                                disabled={!canUpdateShop}
                              />
                            }
                            label="E-mail értesítések engedélyezése"
                          />
                          <Tooltip title="Engedélyezés esetén e-mail értesítéseket küldünk a fontos rendszerüzenetekről.">
                            <IconButton size="small">
                              <Notifications fontSize="small" />
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
                                checked={formData.publicListing}
                                onChange={handleChange}
                                name="publicListing"
                                color="primary"
                                disabled={!canUpdateShop}
                              />
                            }
                            label="Nyilvános megjelenés"
                          />
                          <Tooltip title="Engedélyezés esetén a bolt megjelenik a vásárlók számára elérhető boltok listájában.">
                            <IconButton size="small">
                              <Language fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {canUpdateShop && (
                    <Box mt={3} display="flex" justifyContent="center">
                      <SubmitButton
                        loading={isLoading && !editField}
                        sx={{ width: "50%", py: 1.5 }}
                      >
                        Összes beállítás mentése
                      </SubmitButton>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Paper>

          {canUpdateShop && (
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
                    href="/shop/change-password"
                    fullWidth
                    sx={{ py: 1 }}
                  >
                    Jelszó módosítása
                  </Button>
                </Box>
              </Paper>
            </Box>
          )}
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

export default ShopProfile;
