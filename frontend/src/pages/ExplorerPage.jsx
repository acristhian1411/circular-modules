import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { listComponents } from '../api';

function MetricCard({ title, value, subtitle }) {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ mt: 0.8 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
        {subtitle}
      </Typography>
    </Paper>
  );
}

export default function ExplorerPage() {
  const [components, setComponents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listComponents()
      .then(setComponents)
      .catch((err) => setError(err.message));
  }, []);

  const summary = useMemo(() => {
    const total = components.length;
    const criticalEdges = components.reduce(
      (acc, row) => acc + Number(row.critical_dependency_count ?? 0),
      0
    );
    const totalEdges = components.reduce(
      (acc, row) => acc + Number(row.dependency_count ?? 0),
      0
    );

    const byType = components.reduce((acc, row) => {
      const key = row.type || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return { total, criticalEdges, totalEdges, byType };
  }, [components]);

  return (
    <Stack spacing={2.5}>
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Total Components"
            value={summary.total}
            subtitle="Inventario actual del sistema"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Critical Dependencies"
            value={summary.criticalEdges}
            subtitle="Vinculos que bloquean borrado"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            title="Dependency Links"
            value={summary.totalEdges}
            subtitle="Conexiones de dependencia activas"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          Distribucion por Tipo
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {Object.entries(summary.byType).map(([type, count]) => (
            <Chip key={type} label={`${type}: ${count}`} color="primary" variant="outlined" />
          ))}
          {Object.keys(summary.byType).length === 0 && (
            <Typography color="text.secondary">No hay componentes registrados.</Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
