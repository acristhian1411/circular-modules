import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteComponent, listComponents } from '../api';

export default function ComponentsPage() {
  const [components, setComponents] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ name: '', type: '', parent_id: '', criticality: '' });
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await listComponents({
        ...filters,
        parent_id: filters.parent_id === '' ? undefined : filters.parent_id,
      });
      setComponents(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    listComponents()
      .then((data) => {
        setComponents(data);
        setError('');
      })
      .catch((err) => setError(err.message));
  }, []);

  const knownTypes = useMemo(() => {
    const set = new Set(components.map((row) => row.type).filter(Boolean));
    return Array.from(set).sort();
  }, [components]);

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2}>
          <TextField
            size="small"
            label="Nombre"
            value={filters.name}
            onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            size="small"
            select
            label="Tipo"
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">Todos</MenuItem>
            {knownTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Parent ID"
            type="number"
            value={filters.parent_id}
            onChange={(e) => setFilters((prev) => ({ ...prev, parent_id: e.target.value }))}
            sx={{ minWidth: 120 }}
          />
          <TextField
            size="small"
            select
            label="Criticality"
            value={filters.criticality}
            onChange={(e) => setFilters((prev) => ({ ...prev, criticality: e.target.value }))}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="critical">critical</MenuItem>
            <MenuItem value="optional">optional</MenuItem>
          </TextField>
          <Button variant="contained" onClick={load}>
            Buscar
          </Button>
          <Button variant="outlined" onClick={() => navigate('/editor')}>
            Nuevo componente
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Padre</TableCell>
              <TableCell>Deps</TableCell>
              <TableCell>Criticas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {components.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={600}>{row.name}</Typography>
                    {row.critical_dependency_count > 0 && (
                      <Chip label="impacto" color="error" size="small" />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.parent_name || '-'}</TableCell>
                <TableCell>{row.dependency_count || 0}</TableCell>
                <TableCell>{row.critical_dependency_count || 0}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => navigate(`/editor/${row.id}`)}>
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={async () => {
                        try {
                          await deleteComponent(row.id);
                          load();
                        } catch (err) {
                          setError(err.message);
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {components.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography color="text.secondary">Sin resultados.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
