import { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 276;

const navItems = [
  { label: 'Explorer', path: '/', icon: <DashboardOutlinedIcon /> },
  { label: 'Components', path: '/components', icon: <WidgetsOutlinedIcon /> },
  { label: 'Editor', path: '/editor', icon: <EditNoteOutlinedIcon /> },
  { label: 'Impact Visualizer', path: '/visualizer', icon: <HubOutlinedIcon /> },
];

export default function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentTitle = useMemo(() => {
    const hit = navItems.find((item) =>
      item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
    );
    return hit?.label ?? 'Circular Docs';
  }, [location.pathname]);

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        Circular Docs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Arquitectura y analisis de impacto
      </Typography>
      <List disablePadding>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)
            }
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen((prev) => !prev)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexShrink: 0 }}>
            {currentTitle}
          </Typography>
          <TextField
            size="small"
            placeholder="Buscar componente..."
            sx={{ ml: 'auto', width: { xs: '100%', sm: 320 }, display: { xs: 'none', sm: 'inline-flex' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: '72px',
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
