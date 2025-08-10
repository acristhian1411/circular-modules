import { useEffect, useState } from 'react';
import { getComponentWithDependencies } from '../api';
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
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

/**
 * Muestra un componente con sus dependencias
 * @param {{ component: { id: number|string, name: string, description?: string } }} props
 */
export default function ShowDependencies({ component }) {
  const [dependencies, setDependencies] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        getComponentWithDependencies(component.id).then((data)=>{
            setDependencies(data.dependencies || []);
        });
      } catch (err) {
        setError('Error al cargar dependencias');
      } finally {
        setLoading(false);
      }
    };

    fetchDependencies();
  }, [component.id]);

  return (
    <div>
    <Card sx={{ my: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="h5">{component.name}</Typography>
            <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                // Abrí un modal, redirigí, o dispará tu lógica para agregar dependencia
                setDialogOpen(true);
                }}
            >
                Agregar dependencia
            </Button>
        </Stack>
        {component.description && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {component.description}
          </Typography>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>
          Dependencias
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : dependencies.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No tiene dependencias.
          </Typography>
        ) : (
          <List dense>
            {dependencies.map((dep) => (
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
    {addDependencies(dialogOpen, setDialogOpen)}

    </div>

  );
}

function addDependencies(dialogOpen, setDialogOpen){

  return (
    <div>
        <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)}>
            <DialogTitle>Agregar dependencia</DialogTitle>
            <DialogContent>
                <p>
                  Algo
                </p>
                <DialogActions>
                    <Button onClick={()=>setDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={()=>setDialogOpen(false)}>Aceptar</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </div>
  )
}
