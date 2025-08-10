import { useState } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import { createComponent, updateComponent } from '../api';

export default function ComponentForm({ onCreated, onUpdated, data ,type}) {
  const [form, setForm] = useState({
    id: data.id || '',
    name: data.name || '',
    type: data.type || '',
    description: data.description || '',
    parent_id: data.parent_id || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, parent_id: form.parent_id || null };
    console.log('data: ',data)
    if(type === 'new'){
      await createComponent(data);
      onCreated?.();
    }else{
      await updateComponent(data.id, data);
      onUpdated?.();
    }
    setForm({ name: '', type: '', description: '', parent_id: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" />
      <TextField
        label="Tipo"
        name="type"
        value={form.type}
        onChange={handleChange}
        select
        fullWidth
        margin="normal"
      >
        <MenuItem value="module">Módulo</MenuItem>
        <MenuItem value="controller">Controlador</MenuItem>
        <MenuItem value="model">Modelo</MenuItem>
        <MenuItem value="view">Vista</MenuItem>
        <MenuItem value="function">Función</MenuItem>
      </TextField>
      <TextField
        label="ID del padre (opcional)"
        name="parent_id"
        value={form.parent_id}
        onChange={handleChange}
        type="number"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Descripción"
        name="description"
        value={form.description}
        onChange={handleChange}
        fullWidth
        multiline
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">Crear</Button>
    </form>
  );
}
