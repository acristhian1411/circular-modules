import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createComponent,
  createDependency,
  deleteComponent,
  deleteDependency,
  getComponent,
  listComponents,
  listDependencies,
  updateComponent,
} from '../api';

const defaultForm = {
  name: '',
  type: '',
  description: '',
  parent_id: '',
};

export default function ComponentEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(defaultForm);
  const [components, setComponents] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [dependencyDraft, setDependencyDraft] = useState({ depends_on_id: '', criticality: 'optional' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const loadAll = async () => {
    try {
      const all = await listComponents();
      setComponents(all);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadCurrent = async (componentId) => {
    try {
      const row = await getComponent(componentId);
      setForm({
        name: row.name ?? '',
        type: row.type ?? '',
        description: row.description ?? '',
        parent_id: row.parent_id ?? '',
      });
      const deps = await listDependencies(componentId);
      setDependencies(deps);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadAll();
    if (isEdit) {
      loadCurrent(id);
    }
  }, [id, isEdit]);

  const possibleParents = useMemo(
    () => components.filter((row) => String(row.id) !== String(id)),
    [components, id]
  );

  const dependencyCandidates = useMemo(
    () => components.filter((row) => String(row.id) !== String(id)),
    [components, id]
  );

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      {info && <Alert severity="success">{info}</Alert>}

      <Paper sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isEdit ? `Editar componente #${id}` : 'Crear componente'}
        </Typography>
        <Stack spacing={1.5}>
          <TextField
            label="Nombre"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            label="Tipo"
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
          />
          <TextField
            label="Descripcion"
            multiline
            minRows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <TextField
            label="Padre"
            select
            value={form.parent_id}
            onChange={(e) => setForm((prev) => ({ ...prev, parent_id: e.target.value }))}
          >
            <MenuItem value="">Sin padre</MenuItem>
            {possibleParents.map((row) => (
              <MenuItem key={row.id} value={row.id}>
                {row.name} (#{row.id})
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={async () => {
                setError('');
                setInfo('');
                try {
                  const payload = {
                    ...form,
                    parent_id: form.parent_id === '' ? null : Number(form.parent_id),
                  };
                  if (isEdit) {
                    await updateComponent(id, payload);
                    setInfo('Componente actualizado');
                    await loadCurrent(id);
                  } else {
                    const created = await createComponent(payload);
                    navigate(`/editor/${created.id}`);
                  }
                  await loadAll();
                } catch (err) {
                  setError(err.message);
                }
              }}
            >
              Guardar
            </Button>
            <Button variant="outlined" onClick={() => navigate('/components')}>
              Volver
            </Button>
            {isEdit && (
              <Button
                color="error"
                onClick={async () => {
                  setError('');
                  setInfo('');
                  try {
                    await deleteComponent(id);
                    navigate('/components');
                  } catch (err) {
                    setError(err.message);
                  }
                }}
              >
                Eliminar componente
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {isEdit && (
        <Paper sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Gestion de dependencias
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Define que componentes necesita este nodo y si la dependencia es critica u opcional.
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} sx={{ mb: 2 }}>
            <TextField
              label="Depende de"
              select
              value={dependencyDraft.depends_on_id}
              onChange={(e) =>
                setDependencyDraft((prev) => ({ ...prev, depends_on_id: e.target.value }))
              }
              sx={{ minWidth: 240 }}
            >
              {dependencyCandidates.map((row) => (
                <MenuItem key={row.id} value={row.id}>
                  {row.name} (#{row.id})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Criticidad"
              select
              value={dependencyDraft.criticality}
              onChange={(e) =>
                setDependencyDraft((prev) => ({ ...prev, criticality: e.target.value }))
              }
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="critical">critical</MenuItem>
              <MenuItem value="optional">optional</MenuItem>
            </TextField>
            <Button
              variant="contained"
              onClick={async () => {
                setError('');
                setInfo('');
                try {
                  await createDependency(id, {
                    depends_on_id: Number(dependencyDraft.depends_on_id),
                    criticality: dependencyDraft.criticality,
                  });
                  setInfo('Dependencia agregada');
                  const deps = await listDependencies(id);
                  setDependencies(deps);
                } catch (err) {
                  setError(err.message);
                }
              }}
              disabled={!dependencyDraft.depends_on_id}
            >
              Agregar
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {dependencies.map((dep) => (
              <Paper key={dep.id} variant="outlined" sx={{ p: 1.2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={600}>{dep.name}</Typography>
                    <Chip
                      size="small"
                      label={dep.criticality}
                      color={dep.criticality === 'critical' ? 'error' : 'default'}
                    />
                  </Stack>
                  <Button
                    size="small"
                    color="error"
                    onClick={async () => {
                      try {
                        await deleteDependency(id, dep.id);
                        setDependencies((prev) => prev.filter((row) => row.id !== dep.id));
                      } catch (err) {
                        setError(err.message);
                      }
                    }}
                  >
                    Quitar
                  </Button>
                </Stack>
              </Paper>
            ))}
            {dependencies.length === 0 && (
              <Typography color="text.secondary">Este componente aun no tiene dependencias.</Typography>
            )}
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
