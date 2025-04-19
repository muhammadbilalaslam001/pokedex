'use client';

import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeInfo() {
  const { mode } = useTheme();
  
  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        bottom: 16, 
        right: 16, 
        zIndex: 100, 
        display: { xs: 'none', sm: 'block' } 
      }}
    >
      <Chip
        label={
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
          </Typography>
        }
        color={mode === 'light' ? 'primary' : 'secondary'}
        sx={{ 
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      />
    </Box>
  );
} 