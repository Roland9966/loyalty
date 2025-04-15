// src/components/customer/ShopList.tsx
import React, { useEffect, useState, useCallback } from "react";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Pagination
} from "@mui/material";
import { ShopService } from "../../services/shop.service.ts";
import { Shop } from "../../types/shop.types.ts";
import ShopCard from "./ShopCard.tsx";
import ShopSearch from "./ShopSearch.tsx";

const ShopList: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6; // Oldalanként megjelenő boltok száma

  // Kategóriák kiszűrése az összes boltból
  const extractCategories = useCallback((shopsList: Shop[]) => {
    const uniqueCategories = new Set<string>();
    
    shopsList.forEach(shop => {
      if (shop.category) {
        uniqueCategories.add(shop.category);
      }
    });
    
    return Array.from(uniqueCategories).sort();
  }, []);

  // Boltok lekérdezése
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const data = await ShopService.getShops();
        setShops(data.shops);
        setFilteredShops(data.shops);
        setCategories(extractCategories(data.shops));
        setTotalPages(Math.ceil(data.shops.length / itemsPerPage));
        setError(null);
      } catch (err) {
        console.error("Hiba a boltok betöltésekor:", err);
        setError("Nem sikerült betölteni a boltokat. Kérjük, próbálja újra később.");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [extractCategories]);

  // Boltok szűrése és keresése
  useEffect(() => {
    let results = shops;
    
    // Szűrés név alapján
    if (searchTerm) {
      results = results.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shop.description && shop.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Szűrés kategória alapján
    if (selectedCategory) {
      results = results.filter(shop => shop.category === selectedCategory);
    }
    
    setFilteredShops(results);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
    setPage(1); // Visszaállítjuk az első oldalra
  }, [searchTerm, selectedCategory, shops]);

  // Keresés kezelése
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Kategória szűrés kezelése
  const handleFilterByCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  // Lapozás kezelése
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Az aktuális oldalon látható boltok
  const currentShops = filteredShops.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );

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

  return (
    <>
      <ShopSearch 
        onSearch={handleSearch}
        onFilterByCategory={handleFilterByCategory}
        categories={categories}
      />
      
      {filteredShops.length === 0 ? (
        <Box textAlign="center" my={4}>
          <Typography variant="h6" color="text.secondary">
            {searchTerm || selectedCategory 
              ? "Nincs találat a megadott feltételekkel."
              : "Jelenleg nincsenek elérhető boltok."
            }
          </Typography>
          {(searchTerm || selectedCategory) && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              Próbálja meg módosítani a keresési feltételeket.
            </Typography>
          )}
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {currentShops.map((shop) => (
              <Box 
                key={shop.id} 
                sx={{ 
                  width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                  mb: 2 
                }}
              >
                <ShopCard shop={shop} />
              </Box>
            ))}
          </Box>
          
          {/* Lapozó */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default ShopList;