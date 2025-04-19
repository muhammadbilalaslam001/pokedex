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
} from "@mui/material";
import { PokemonRow } from "./PokemonRow";
import { trpc } from "@/trpc/client";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";

export function SinglePokemonForm() {
  const [pokemonName, setPokemonName] = useState("");
  const [debouncedPokemonName] = useDebounce(pokemonName, 500);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const pokemonQuery = trpc.pokemon.getPokemonByName.useQuery(
    debouncedPokemonName,
    {
      enabled: debouncedPokemonName.length > 2,
      retry: 1,
      retryDelay: 1000,
    }
  );

  useEffect(() => {
    if (pokemonQuery.data && isSearching) {
      setIsSearching(false);
    }

    if (pokemonQuery.error && isSearching) {
      setIsSearching(false);
    }
  }, [
    pokemonQuery.data,
    pokemonQuery.error,
    isSearching,
    debouncedPokemonName,
  ]);

  useEffect(() => {
    if (debouncedPokemonName.length > 2) {
      setIsSearching(true);
    }
  }, [debouncedPokemonName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pokemonName.trim().length > 2) {
      setIsSearching(true);
      pokemonQuery.refetch();
    } else {
      toast.error("Please enter at least 3 characters");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPokemonName(e.target.value);
  };

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
          Find a Pokémon
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Pokémon Name"
            value={pokemonName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            helperText="Enter a Pokémon name (e.g., Bulbasaur)"
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
            disabled={pokemonQuery.isFetching || pokemonName.length < 3}
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
            {pokemonQuery.error?.message || "Pokémon not found"}
          </Typography>
        </Box>
      )}

      {pokemonQuery.isSuccess &&
        pokemonQuery.data &&
        !pokemonQuery.isFetching && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Result:
            </Typography>
            <PokemonRow
              id={pokemonQuery.data.id}
              name={pokemonQuery.data.name}
              types={pokemonQuery.data.types}
              sprite={pokemonQuery.data.sprite}
            />
          </Box>
        )}
    </Container>
  );
}
