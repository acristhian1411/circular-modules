import { useEffect, useState } from 'react';
import { getComponentWithDependencies, addDependency  } from '../api';
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
import ComponentGraph from './ComponentGraph';

/**
 * Muestra un componente con sus dependencias
 * @param {{ component: { id: number|string, name: string, description?: string } }} props
 */
export default function ShowDependencies({ component }) {
  const [dependencies, setDependencies] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [graphOpen, setGraphOpen] = useState(false);

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
                setGraphOpen(true);
                }}
            >
                Agregar dependencia
            </Button>
            <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                // Abrí un modal, redirigí, o dispará tu lógica para agregar dependencia
                setDialogOpen(true);
                }}
            >
                Mostrar dependencia
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
    {addDependencies(dialogOpen, setDialogOpen, component.id)}
    {showGraph(component.id, component.name, graphOpen, setGraphOpen)}

    </div>

  );
}

function addDependencies(dialogOpen, setDialogOpen,componentId){
  const [dependencyId, setDependencyId] = useState('');
 const insertDependency = async (componentId, dependencyId) => {
    try {
      const response = await addDependency(componentId, dependencyId);
      console.log('Dependency added:', response);
      // Aquí podrías actualizar el estado para reflejar el cambio en la UI
    } catch (error) {
      console.error('Error adding dependency:', error);
    }
 }
  return (
    <div>
        <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)}>
            <DialogTitle>Agregar dependencia</DialogTitle>
            <DialogContent>
                <form>
                  <Stack spacing={2}>
                    <Typography variant="body2">Selecciona el componente a agregar como dependencia:</Typography>
                    <input
                      type="text"
                      placeholder="ID o nombre del componente"
                      style={{ padding: '8px', width: '100%' }}
                      value={dependencyId}
                      onChange={(e) => setDependencyId(e.target.value)}
                      // Puedes agregar un estado para manejar el valor del input
                    />
                    {/* Si tienes una lista de componentes, podrías usar un select en vez de input */}
                  </Stack>
                </form>
                <DialogActions>
                    <Button onClick={()=>setDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={()=>insertDependency(componentId,dependencyId)}>Aceptar</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </div>
  )
}

function showGraph(id, name, dialogOpen, setDialogOpen){

  return (
    <div>
        <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Dependencias de {name}</DialogTitle>
            <DialogContent>
                <ComponentGraph component={{id, name}} />
                <DialogActions>
                    <Button onClick={()=>setDialogOpen(false)}>Cerrar</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </div>
  )

}