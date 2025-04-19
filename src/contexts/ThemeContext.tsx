'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    
    if (savedTheme) {
      setMode(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('theme', mode);
    
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);
  
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#3f51b5' : '#7986cb', // Indigo
        light: mode === 'light' ? '#757de8' : '#9fa8da',
        dark: mode === 'light' ? '#303f9f' : '#5c6bc0',
      },
      secondary: {
        main: mode === 'light' ? '#ef5350' : '#ff8a80', // Red
        light: mode === 'light' ? '#ff867c' : '#ffbcaf',
        dark: mode === 'light' ? '#d32f2f' : '#c62828',
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#121212', // Pure white for light mode
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
        secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      },
      error: {
        main: '#f44336',
        light: '#e57373',
        dark: '#d32f2f',
      },
      success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            color: mode === 'light' ? '#3f51b5' : '#7986cb',
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0,0,0,0.05)' 
              : '0 1px 3px rgba(0,0,0,0.2)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            boxShadow: mode === 'light' 
              ? '0 2px 10px rgba(0,0,0,0.05)' 
              : '0 2px 10px rgba(0,0,0,0.2)',
            borderRadius: '12px',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
          },
        },
      },
    },
    typography: {
      fontFamily: '"Geist", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
  });
  
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            top: 60,
          }}
          toastOptions={{
            duration: 5000,
            style: {
              background: mode === 'light' ? '#ffffff' : '#2a2a2a',
              color: mode === 'light' ? '#333333' : '#ffffff',
              border: mode === 'light' ? '1px solid #f0f0f0' : '1px solid #444444',
              boxShadow: mode === 'light' 
                ? '0 4px 12px rgba(0,0,0,0.08)' 
                : '0 4px 12px rgba(0,0,0,0.4)',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
              maxWidth: '400px',
              width: '100%',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4caf50',
                secondary: 'white',
              },
              style: {
                backgroundColor: mode === 'light' ? '#f0fff0' : '#1e3a1e',
                border: mode === 'light' ? '1px solid #c8e6c9' : '1px solid #2e7d32',
                color: mode === 'light' ? '#2e7d32' : '#a5d6a7',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef5350',
                secondary: 'white',
              },
              style: {
                backgroundColor: mode === 'light' ? '#fff0f0' : '#3e1e1e',
                border: mode === 'light' ? '1px solid #ffcdd2' : '1px solid #c62828',
                color: mode === 'light' ? '#c62828' : '#ef9a9a',
              },
            },
          }}
        />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 