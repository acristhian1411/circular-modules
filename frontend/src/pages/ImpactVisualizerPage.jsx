import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Chip,
  MenuItem,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  TextField,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ListIcon from '@mui/icons-material/List';
import { getImpactTree, listComponents, listDependencies, listDependents } from '../api';
import ImpactGraph from '../components/ImpactGraph';

export default function ImpactVisualizerPage() {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [mode, setMode] = useState('impact');
  const [view, setView] = useState('graph');
  const [criticalityFilter, setCriticalityFilter] = useState('all');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listComponents()
      .then((data) => {
        setComponents(data);
        if (data.length > 0) {
          setSelectedId(String(data[0].id));
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!selectedId) return;
      try {
        setError('');
        if (mode === 'impact') {
          const result = await getImpactTree(selectedId);
          setRows(result.map((row) => ({ ...row, source: 'impact' })));
          return;
        }
        if (mode === 'dependents') {
          const result = await listDependents(selectedId);
          setRows(result.map((row) => ({ ...row, source: 'direct-dependents' })));
          return;
        }
        const result = await listDependencies(selectedId);
        setRows(result.map((row) => ({ ...row, source: 'direct-dependencies' })));
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, [selectedId, mode]);

  const filteredRows = useMemo(() => {
    if (criticalityFilter === 'all') {
      return rows;
    }
    return rows.filter((row) => row.criticality === criticalityFilter);
  }, [rows, criticalityFilter]);

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} alignItems={{ md: 'center' }}>
          <TextField
            label="Componente"
            size="small"
            select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            sx={{ minWidth: 280 }}
          >
            {components.map((row) => (
              <MenuItem key={row.id} value={String(row.id)}>
                {row.name} (#{row.id})
              </MenuItem>
            ))}
          </TextField>

          <ToggleButtonGroup
            exclusive
            value={mode}
            size="small"
            onChange={(_, value) => {
              if (value) setMode(value);
            }}
          >
            <ToggleButton value="impact">Impacto recursivo</ToggleButton>
            <ToggleButton value="dependents">Dependientes directos</ToggleButton>
            <ToggleButton value="dependencies">Dependencias directas</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Filtro criticality"
            size="small"
            select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
            sx={{ minWidth: 180, ml: { md: 'auto' } }}
          >
            <MenuItem value="all">all</MenuItem>
            <MenuItem value="critical">critical</MenuItem>
            <MenuItem value="optional">optional</MenuItem>
          </TextField>

          <ToggleButtonGroup
            exclusive
            value={view}
            size="small"
            onChange={(_, v) => { if (v) setView(v); }}
          >
            <ToggleButton value="graph" title="Grafo"><AccountTreeIcon fontSize="small" /></ToggleButton>
            <ToggleButton value="list" title="Lista"><ListIcon fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Resultado
        </Typography>

        {view === 'graph' && selectedId ? (
          <ImpactGraph
            key={`${selectedId}-${mode}`}
            rootId={Number(selectedId)}
            rootName={components.find((c) => String(c.id) === selectedId)?.name ?? `#${selectedId}`}
            rows={filteredRows}
            mode={mode}
          />
        ) : (
          <Stack spacing={1}>
            {filteredRows.map((row) => (
              <Paper key={`${row.source}-${row.id}-${row.depth || 0}`} variant="outlined" sx={{ p: 1.2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={650}>{row.name}</Typography>
                    <Chip size="small" label={row.type || 'unknown'} variant="outlined" />
                    {row.criticality && (
                      <Chip
                        size="small"
                        label={row.criticality}
                        color={row.criticality === 'critical' ? 'error' : 'default'}
                      />
                    )}
                  </Stack>
                  {typeof row.depth === 'number' && <Chip size="small" label={`depth ${row.depth}`} />}
                </Stack>
              </Paper>
            ))}
            {filteredRows.length === 0 && (
              <Typography color="text.secondary">No hay resultados para el modo seleccionado.</Typography>
            )}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
