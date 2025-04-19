"use client";

import { Box, Typography, Fade, Alert, CircularProgress } from "@mui/material";
import { PokemonRow } from "./PokemonRow";

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  sprite: string;
};

type PokedexTableProps = {
  pokemon: Pokemon[];
  isLoading?: boolean;
  error?: Error | null;
};

export function PokedexTable({ pokemon, isLoading, error }: PokedexTableProps) {
  if (isLoading) {
    return (
      <Fade in={true} style={{ transitionDelay: "300ms" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body1" color="text.secondary">
            Loading Pokemon data...
          </Typography>
        </Box>
      </Fade>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        variant="outlined"
        sx={{
          borderRadius: 2,
          py: 2,
          px: 3,
          mb: 2,
          fontWeight: 500,
        }}
      >
        {error.message}
      </Alert>
    );
  }

  if (pokemon.length === 0) {
    return (
      <Box
        textAlign="center"
        py={4}
        sx={{
          borderRadius: 2,
          border: (theme) => `1px dashed ${theme.palette.divider}`,
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.02)"
              : "rgba(255,255,255,0.02)",
          p: 4,
        }}
      >
        <Typography color="text.secondary" variant="body1">
          No Pokemon found
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={true}>
      <Box>
        {pokemon.map((p) => (
          <PokemonRow
            key={p.id}
            id={p.id}
            name={p.name}
            types={p.types}
            sprite={p.sprite}
          />
        ))}
      </Box>
    </Fade>
  );
}
