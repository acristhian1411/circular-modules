import { createTheme } from '@mui/material/styles';

const tokens = {
  color: {
    bg: '#f4f5f7',
    panel: '#ffffff',
    text: '#152033',
    subtleText: '#4b5a73',
    primary: '#0f6cbd',
    primaryDark: '#0a4f8a',
    accent: '#1f8f5f',
    critical: '#c4314b',
    optional: '#697586',
    border: '#d8dee8',
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 18,
  },
};

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tokens.color.primary,
      dark: tokens.color.primaryDark,
    },
    secondary: {
      main: tokens.color.accent,
    },
    background: {
      default: tokens.color.bg,
      paper: tokens.color.panel,
    },
    text: {
      primary: tokens.color.text,
      secondary: tokens.color.subtleText,
    },
    error: {
      main: tokens.color.critical,
    },
    divider: tokens.color.border,
  },
  shape: {
    borderRadius: tokens.radius.md,
  },
  typography: {
    fontFamily: ['Space Grotesk', 'Segoe UI', 'Tahoma', 'sans-serif'].join(','),
    h4: {
      fontWeight: 700,
      letterSpacing: '0.01em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '0.01em',
    },
    h6: {
      fontWeight: 650,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 650,
      textTransform: 'none',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.color.border}`,
          boxShadow: '0 8px 24px rgba(12, 32, 62, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
        },
      },
    },
  },
});

export const semanticColors = {
  criticalEdge: tokens.color.critical,
  optionalEdge: tokens.color.optional,
  layerBackend: '#0f6cbd',
  layerFrontend: '#1f8f5f',
  layerData: '#cf6d11',
};
