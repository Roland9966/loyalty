// src/components/customer/ShopSearch.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

interface ShopSearchProps {
  onSearch: (searchTerm: string) => void;
  onFilterByCategory: (category: string | null) => void;
  categories: string[];
}

const ShopSearch: React.FC<ShopSearchProps> = ({
  onSearch,
  onFilterByCategory,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Keresés, amikor a felhasználó befejezi a gépelést
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      onSearch(searchTerm);
    }, 500); // 500ms késleltetés

    return () => clearTimeout(delaySearch);
  }, [searchTerm, onSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const category = event.target.value;
    setSelectedCategory(category);
    onFilterByCategory(category || null);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    onFilterByCategory(null);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    onSearch("");
    onFilterByCategory(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Keresőmező */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Bolt keresése név alapján..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Keresés törlése"
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Szűrők megjelenítése/elrejtése gomb */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={toggleFilters}
          size="small"
        >
          {showFilters ? "Szűrők elrejtése" : "Szűrők megjelenítése"}
        </Button>

        {(searchTerm || selectedCategory) && (
          <Button
            variant="text"
            onClick={handleClearAll}
            size="small"
            color="secondary"
          >
            Összes törlése
          </Button>
        )}
      </Box>

      {/* Aktív szűrők jelzése */}
      {(searchTerm || selectedCategory) && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {searchTerm && (
            <Chip
              label={`Keresés: ${searchTerm}`}
              onDelete={handleClearSearch}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {selectedCategory && (
            <Chip
              label={`Kategória: ${selectedCategory}`}
              onDelete={handleClearCategory}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      )}

      {/* Szűrők panel */}
      {showFilters && (
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
            <InputLabel id="category-select-label">Kategória</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory || ""}
              onChange={handleCategoryChange}
              label="Kategória"
            >
              <MenuItem value="">
                <em>Összes kategória</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default ShopSearch;