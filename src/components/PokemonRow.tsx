"use client";

import {
  Chip,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";

type PokemonRowProps = {
  id: number;
  name: string;
  types: string[];
  sprite: string;
};

export function PokemonRow({ id, name, types, sprite }: PokemonRowProps) {
  const theme = useMuiTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        mb: 2,
        display: "flex",
        alignItems: "center",
        flexDirection: isSmallScreen ? "column" : "row",
        textAlign: isSmallScreen ? "center" : "left",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: isDarkMode
            ? "0 8px 16px rgba(0, 0, 0, 0.5)"
            : "0 8px 16px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          width: isSmallScreen ? 80 : 100,
          height: isSmallScreen ? 80 : 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDarkMode
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.03)",
          borderRadius: "50%",
          m: isSmallScreen ? 1 : 2,
          mt: isSmallScreen ? 2 : undefined,
          p: 1,
        }}
      >
        <Avatar
          src={sprite}
          alt={name}
          sx={{
            width: isSmallScreen ? 60 : 80,
            height: isSmallScreen ? 60 : 80,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        />
      </Box>
      <CardContent
        sx={{
          display: "flex",
          flexGrow: 1,
          alignItems: "center",
          flexDirection: isSmallScreen ? "column" : "row",
          p: isSmallScreen ? 1 : 2,
        }}
      >
        <Box
          sx={{
            width: isSmallScreen ? "auto" : "60px",
            mr: isSmallScreen ? 0 : 2,
            mb: isSmallScreen ? 1 : 0,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: "bold" }}
          >
            #{id}
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            mb: isSmallScreen ? 1 : 0,
            textAlign: isSmallScreen ? "center" : "left",
          }}
        >
          <Typography
            variant={isSmallScreen ? "subtitle1" : "h6"}
            component="div"
            sx={{
              fontWeight: "bold",
              color: isDarkMode
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
            }}
          >
            {name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: isSmallScreen ? "center" : "flex-end",
            gap: 0.5,
          }}
        >
          {types.map((type) => (
            <Chip
              key={type}
              label={type}
              size={isSmallScreen ? "small" : "medium"}
              sx={{
                textTransform: "capitalize",
                backgroundColor: getTypeColor(type, isDarkMode),
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

function getTypeColor(type: string, isDark: boolean): string {
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

  return isDark
    ? typeColors[type]?.dark || "#777777"
    : typeColors[type]?.light || "#777777";
}
