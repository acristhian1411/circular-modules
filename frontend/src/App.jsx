import { Container, Typography } from '@mui/material';
import ComponentList from './components/ComponentList';

function App() {
  return (
    <Container maxWidth="xl" sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Documentación de Componentes
      </Typography>
      <ComponentList />
    </Container>
  );
}

export default App;
