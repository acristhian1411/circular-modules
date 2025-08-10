import { useEffect, useState } from 'react';
import { getComponentChildren } from '../api';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

/**
 * Muestra un componente con sus dependencias
 * @param {{ component: { id: number|string, name: string, description?: string } }} props
 */
export default function ShowChildren({ component }) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        getComponentChildren(component.id).then((data)=>{
            setChildren(data || []);
        });
      } catch (err) {
        setError('Error al cargar hijos');
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [component.id]);

  return (
    <Card sx={{ my: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="h5">{component.name}</Typography>
            <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  alert(`Agregar hijo para: ${component.name}`);
                }}
            >
                Agregar hijo
            </Button>
        </Stack>
        {component.description && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {component.description}
          </Typography>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>
          Hijos
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : children.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No tiene hijos.
          </Typography>
        ) : (
          <List dense>
            {children.map((dep) => (
              <ListItem key={dep.id}>
                <ListItemText
                  primary={dep.name}
                  secondary={dep.description || 'Sin descripción'}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
