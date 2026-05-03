import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { login } from '../api';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      await onLoginSuccess();
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 420, p: 3 }}>
        <Stack spacing={2.2} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Circular Docs
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Inicia sesion con tu cuenta de Auth Service
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
