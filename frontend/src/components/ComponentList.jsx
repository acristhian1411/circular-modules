import { useEffect, useState } from 'react';
import { fetchComponents } from '../api';
import {  
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, 
    Button, 
    Table,
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper 
} from '@mui/material';
import ComponentForm from './ComponentForm';
import ShowDependencies from './ShowDependencies';
import ShowChildren from './ShowChildren';
import { deleteComponent } from '../api';

export default function ComponentList() {
    const [components, setComponents] = useState([]);
    const [formData, setFormData] = useState({ name: '', type: 'default', description: '', parent: 0 });
    const [modalOpen, setModalOpen] = useState({open:false, type: 'new'});

    const openModal = (open, type, data={}) => {
        setFormData(data);
        setModalOpen({open, type})
    };
    const closeModal = () => {
        setModalOpen({open:false,type:''});
        setFormData({ name: '', type: 'default', description: '', parent: 0 });
        fetchComponents().then(setComponents);
    };

    const deleteData = async (id) => {
        await deleteComponent(id);
        fetchComponents().then(setComponents);
    };

  useEffect(() => {
    fetchComponents().then(setComponents);
  }, []);

  return (
    <div>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Padre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell colSpan={2} align='center'>
                <Button variant="contained" color="primary" onClick={() => openModal(true, 'new')}>Agregar</Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {components.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.type}</TableCell>
              <TableCell>{c.parent_id ? c?.parent_name || 'N/A' : '-'}</TableCell>
              <TableCell>{c.description || '-'}</TableCell>
              <TableCell>
                <Button variant='contained' color='info' onClick={() => openModal(true, 'showChildren',c)}>Ver hijos</Button>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="info" onClick={() => openModal(true, 'showDeps',c)}>Ver dependencias</Button>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="warning" onClick={() => openModal(true, 'edit',c)}>Editar</Button>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => deleteData(c.id)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Dialog open={modalOpen.open && (modalOpen.type === 'new' || modalOpen.type === 'edit')} onClose={closeModal}>
        <DialogTitle>{modalOpen.type === 'new' ? 'Nuevo' : 'Editar'} Componente</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <ComponentForm onCreated={closeModal} onUpdated={closeModal} data={formData} type={modalOpen.type} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancelar</Button>
          
        </DialogActions>
      </Dialog>
      <Dialog open={modalOpen.open && modalOpen.type === 'showDeps'} onClose={closeModal}>
        <DialogTitle>{modalOpen.type === 'showDeps' ? 'Ver' : 'Editar'} Dependencias</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <ShowDependencies component={formData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancelar</Button>
          
        </DialogActions>
      </Dialog>
      <Dialog open={modalOpen.open && modalOpen.type === 'showChildren'} onClose={closeModal}>
        <DialogTitle>{modalOpen.type === 'showChildren' ? 'Ver' : 'Editar'} Hijos</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <ShowChildren component={formData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancelar</Button>
          
        </DialogActions>
      </Dialog>
</div>
  );
}
