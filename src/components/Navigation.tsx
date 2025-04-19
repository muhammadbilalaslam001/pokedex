"use client";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
        fill="currentColor"
      />
    </svg>
  );
}

const navigationItems = [
  { path: "/", label: "Single Pokémon" },
  { path: "/multiple", label: "Multiple Pokémon" },
  { path: "/filterable", label: "Filterable Pokédex" },
];

export function Navigation() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isActive = (path: string) => pathname === path;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        mb: 2,
        borderBottom: (theme) =>
          `1px solid ${
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.05)"
              : "rgba(255,255,255,0.1)"
          }`,
      }}
    >
      <Container maxWidth="md">
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {isMobile ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    ml: 1,
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  Pokédex
                </Typography>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    width: 200,
                    boxShadow:
                      theme.palette.mode === "light"
                        ? "0 8px 16px rgba(0,0,0,0.1)"
                        : "0 8px 16px rgba(0,0,0,0.4)",
                    borderRadius: 2,
                  },
                }}
              >
                {navigationItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    component={Link}
                    href={item.path}
                    onClick={handleMenuClose}
                    sx={{
                      color: isActive(item.path)
                        ? theme.palette.primary.main
                        : "inherit",
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {navigationItems.map((item) => (
                <Link key={item.path} href={item.path} passHref>
                  <Button
                    color={isActive(item.path) ? "primary" : "inherit"}
                    variant={isActive(item.path) ? "contained" : "text"}
                    sx={{
                      fontWeight: 600,
                      px: 2,
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </Box>
          )}

          <ThemeToggle />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
