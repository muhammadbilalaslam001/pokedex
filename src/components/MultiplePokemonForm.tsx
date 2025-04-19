"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Pagination,
  Stack,
} from "@mui/material";
import { PokedexTable } from "./PokedexTable";
import { trpc } from "@/trpc/client";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 5;

export function MultiplePokemonForm() {
  const [pokemonNames, setPokemonNames] = useState("");
  const [pokemonArray, setPokemonArray] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const pokemonQuery = trpc.pokemon.getPokemonByNames.useQuery(pokemonArray, {
    enabled: pokemonArray.length > 0,
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (pokemonQuery.data && isSearching) {
      setIsSearching(false);
    }

    if (pokemonQuery.error && isSearching) {
      setIsSearching(false);
    }
  }, [pokemonQuery.data, pokemonQuery.error, isSearching, pokemonArray.length]);

  useEffect(() => {
    setPage(1);
  }, [pokemonQuery.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pokemonNames.trim()) {
      const namesArray = pokemonNames
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (namesArray.length === 0) {
        toast.error("Please enter at least one Pokémon name");
        return;
      }

      setPokemonArray(namesArray);
      setIsSearching(true);
      setTimeout(() => {
        pokemonQuery.refetch();
      }, 100);
    }
  };

  const paginatedPokemon = pokemonQuery.data
    ? pokemonQuery.data.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      )
    : [];

  const totalPages = pokemonQuery.data
    ? Math.ceil(pokemonQuery.data.length / ITEMS_PER_PAGE)
    : 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          border: (theme) =>
            `1px solid ${theme.palette.mode === "light" ? "#f0f0f0" : "#333"}`,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Find Multiple Pokémon
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Pokémon Names"
            value={pokemonNames}
            onChange={(e) => setPokemonNames(e.target.value)}
            fullWidth
            variant="outlined"
            helperText="Enter comma-separated Pokémon names (e.g., Bulbasaur, Pikachu, Charmander)"
            InputProps={{
              endAdornment: pokemonQuery.isFetching && (
                <CircularProgress size={24} color="inherit" />
              ),
            }}
            autoComplete="off"
            inputRef={inputRef}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={pokemonQuery.isFetching || !pokemonNames.trim()}
            size="large"
            sx={{ py: 1.5 }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {pokemonQuery.isFetching && (
        <Box
          textAlign="center"
          py={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress size={40} thickness={4} />
          <Typography sx={{ ml: 2 }}>Searching for Pokémon...</Typography>
        </Box>
      )}

      {pokemonQuery.isError && !pokemonQuery.isFetching && (
        <Box
          textAlign="center"
          py={4}
          sx={{
            borderRadius: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? "#ffebee" : "#4a2424",
            p: 3,
          }}
        >
          <Typography color="error" variant="body1" fontWeight="medium">
            Error: {pokemonQuery.error?.message || "Failed to fetch Pokémon"}
          </Typography>
        </Box>
      )}

      {pokemonQuery.isSuccess &&
        pokemonQuery.data &&
        pokemonQuery.data.length > 0 &&
        !pokemonQuery.isFetching && (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === "light" ? "#f0f0f0" : "#333"
                }`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                Results ({pokemonQuery.data.length} Pokémon):
              </Typography>
              {totalPages > 1 && (
                <Typography variant="body2" color="text.secondary">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(page * ITEMS_PER_PAGE, pokemonQuery.data.length)} of{" "}
                  {pokemonQuery.data.length}
                </Typography>
              )}
            </Box>

            <PokedexTable pokemon={paginatedPokemon} />

            {totalPages > 1 && (
              <Stack
                spacing={2}
                sx={{ mt: 4, display: "flex", alignItems: "center" }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  color="primary"
                  showFirstButton
                  showLastButton
                  size="large"
                />
              </Stack>
            )}
          </Paper>
        )}

      {pokemonQuery.isSuccess &&
        pokemonQuery.data &&
        pokemonQuery.data.length === 0 &&
        !pokemonQuery.isFetching && (
          <Box
            textAlign="center"
            py={4}
            sx={{
              borderRadius: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? "#ffebee" : "#4a2424",
              p: 3,
            }}
          >
            <Typography variant="body1" fontWeight="medium">
              No Pokémon found with the given names
            </Typography>
          </Box>
        )}
    </Container>
  );
}
