"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Pagination,
  Stack,
  Alert,
} from "@mui/material";
import { PokemonTypeSelection } from "./PokemonTypeSelection";
import { PokedexTable } from "./PokedexTable";
import { trpc } from "@/trpc/client";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 5;

export function FilterablePokedexTable() {
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const [userInitiatedChange, setUserInitiatedChange] = useState(false);
  const prevTypeRef = useRef<string | undefined>(undefined);

  const typesQuery = trpc.pokemon.getAllTypes.useQuery(undefined, {
    retry: 1,
  });

  useEffect(() => {
    if (typesQuery.data && initialLoad) {
      setInitialLoad(false);
    }

    if (typesQuery.error && initialLoad) {
      setInitialLoad(false);
    }
  }, [typesQuery.data, typesQuery.error, initialLoad]);

  const pokemonQuery = trpc.pokemon.getPokemonByType.useQuery(selectedType, {
    retry: 1,
  });

  useEffect(() => {
    if (pokemonQuery.data && userInitiatedChange && !initialLoad) {
      const data = pokemonQuery.data;

      if (selectedType) {
        if (data.length === 0) {
          toast.error(`No ${selectedType}-type Pokémon found`);
        } else {
          toast.success(`Found ${data.length} ${selectedType}-type Pokémon`);
        }
      } else if (prevTypeRef.current !== undefined) {
        toast.success(`Loaded all ${data.length} Pokémon`);
      }

      setUserInitiatedChange(false);
      prevTypeRef.current = selectedType;
    }

    if (pokemonQuery.error && userInitiatedChange) {
      toast.error(`Error loading Pokémon: ${pokemonQuery.error.message}`);
      setUserInitiatedChange(false);
    }
  }, [
    pokemonQuery.data,
    pokemonQuery.error,
    selectedType,
    userInitiatedChange,
    initialLoad,
  ]);

  useEffect(() => {
    setPage(1);
  }, [selectedType]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleSelectType = (type: string | undefined) => {
    if (type !== selectedType) {
      setSelectedType(type);
      setUserInitiatedChange(true);
      setInitialLoad(false);
    }
  };

  const totalPokemon = pokemonQuery.data?.length || 0;
  const totalPages = Math.ceil(totalPokemon / ITEMS_PER_PAGE);
  const displayedPokemon = pokemonQuery.data
    ? pokemonQuery.data.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      )
    : [];

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
          Pokédex
        </Typography>

        <Box sx={{ mb: 4 }}>
          <PokemonTypeSelection
            selectedType={selectedType}
            selectType={handleSelectType}
            types={typesQuery.data || []}
            isLoading={typesQuery.isLoading || typesQuery.isFetching}
          />
        </Box>
      </Paper>

      {(pokemonQuery.isLoading ||
        pokemonQuery.isFetching ||
        typesQuery.isLoading ||
        typesQuery.isFetching) && (
        <Box
          textAlign="center"
          py={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress size={40} thickness={4} />
          <Typography sx={{ ml: 2 }}>
            {typesQuery.isLoading || typesQuery.isFetching
              ? "Loading types..."
              : "Loading Pokémon..."}
          </Typography>
        </Box>
      )}

      {!pokemonQuery.isLoading &&
        !pokemonQuery.isFetching &&
        !typesQuery.isLoading &&
        !typesQuery.isFetching && (
          <Box>
            {pokemonQuery.isError ? (
              <Alert
                severity="error"
                variant="filled"
                sx={{
                  borderRadius: 2,
                  py: 2,
                  mb: 2,
                }}
              >
                {pokemonQuery.error?.message || "Failed to load Pokémon"}
              </Alert>
            ) : (
              <>
                {pokemonQuery.isSuccess && totalPokemon > 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
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
                        {selectedType
                          ? `${
                              selectedType.charAt(0).toUpperCase() +
                              selectedType.slice(1)
                            }-type Pokémon`
                          : "All Pokémon"}
                      </Typography>
                      {totalPages > 1 && (
                        <Typography variant="body2" color="text.secondary">
                          Showing {(page - 1) * ITEMS_PER_PAGE + 1}-
                          {Math.min(page * ITEMS_PER_PAGE, totalPokemon)} of{" "}
                          {totalPokemon}
                        </Typography>
                      )}
                    </Box>

                    <PokedexTable
                      pokemon={displayedPokemon}
                      isLoading={false}
                      error={null}
                    />

                    {totalPages > 1 && (
                      <Stack
                        spacing={2}
                        sx={{ mt: 4, display: "flex", alignItems: "center" }}
                      >
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          showFirstButton
                          showLastButton
                          size="large"
                        />
                      </Stack>
                    )}
                  </Paper>
                ) : (
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
                      No Pokémon found
                      {selectedType ? ` with type: ${selectedType}` : ""}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
    </Container>
  );
}
