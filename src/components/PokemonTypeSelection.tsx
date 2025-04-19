"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  SelectChangeEvent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type PokemonTypeSelectionProps = {
  selectedType: string | undefined;
  selectType: (type: string | undefined) => void;
  types: string[];
  isLoading?: boolean;
};

export function PokemonTypeSelection({
  selectedType,
  selectType,
  types,
  isLoading = false,
}: PokemonTypeSelectionProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    selectType(value === "all" ? undefined : value);
  };

  const getTypeColor = (type: string): string => {
    const typeColors: Record<string, { light: string; dark: string }> = {
      normal: { light: "#A8A878", dark: "#A8A878" },
      fire: { light: "#F08030", dark: "#FF9C54" },
      water: { light: "#6890F0", dark: "#7EABFF" },
      electric: { light: "#F8D030", dark: "#FFE159" },
      grass: { light: "#78C850", dark: "#8CD675" },
      ice: { light: "#98D8D8", dark: "#B3EFEF" },
      fighting: { light: "#C03028", dark: "#EB4D43" },
      poison: { light: "#A040A0", dark: "#CC5BCC" },
      ground: { light: "#E0C068", dark: "#F5D992" },
      flying: { light: "#A890F0", dark: "#C4AFF5" },
      psychic: { light: "#F85888", dark: "#FF7FAC" },
      bug: { light: "#A8B820", dark: "#C9DD35" },
      rock: { light: "#B8A038", dark: "#D9BF53" },
      ghost: { light: "#705898", dark: "#9275C0" },
      dragon: { light: "#7038F8", dark: "#955AFF" },
      dark: { light: "#705848", dark: "#8B6E5A" },
      steel: { light: "#B8B8D0", dark: "#D1D1E0" },
      fairy: { light: "#EE99AC", dark: "#FFB3C3" },
    };

    return isDarkMode
      ? typeColors[type]?.dark || "#777777"
      : typeColors[type]?.light || "#777777";
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
      <Typography
        variant="body1"
        gutterBottom
        align="center"
        sx={{ mb: 2, fontWeight: 500 }}
      >
        Filter Pokemon by Type
      </Typography>

      <FormControl
        fullWidth
        disabled={isLoading}
        sx={{
          ".MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      >
        <InputLabel id="pokemon-type-label">Pokemon Type</InputLabel>
        <Select
          labelId="pokemon-type-label"
          id="pokemon-type-select"
          value={selectedType || "all"}
          label="Pokemon Type"
          onChange={handleChange}
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
            },
          }}
          endAdornment={
            isLoading ? (
              <CircularProgress size={20} color="inherit" sx={{ mr: 2 }} />
            ) : null
          }
        >
          <MenuItem value="all">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Chip
                label="All"
                size="small"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  mr: 1,
                  fontWeight: "bold",
                }}
              />
              <Typography>All Types</Typography>
            </Box>
          </MenuItem>

          {types.map((type) => (
            <MenuItem key={type} value={type}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Chip
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  size="small"
                  sx={{
                    backgroundColor: getTypeColor(type),
                    color: "white",
                    mr: 1,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                />
                <Typography sx={{ textTransform: "capitalize" }}>
                  {type} Type
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
