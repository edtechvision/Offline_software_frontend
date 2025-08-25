import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import {
  Dashboard,
  School,
  Payments,
  CurrencyRupee,
  Phone,
  Inventory2,
  ListAlt,
  Logout,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

const AdminCenterSidebar = ({ isCollapsed, onToggle, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const menuItems = [
    { id: 1, label: 'Dashboard', icon: Dashboard, path: '/dashboard', color: '#0ea5e9' },
    {
      id: 2,
      label: 'Students',
      icon: School,
      path: '/students',
      hasSubmenu: true,
      submenu: [
        { label: 'Student List', path: '/students' },
        { label: 'Register New Student', path: '/students' }
      ],
      color: '#6366f1'
    },
    { id: 3, label: 'Expenses Upload', icon: Payments, path: '/expenses-upload', color: '#f59e0b' },
    {
      id: 4,
      label: 'Fee',
      icon: CurrencyRupee,
      path: '/fee',
      hasSubmenu: true,
      submenu: [
        { label: 'Fee Pending Records', path: '/fee' },
        { label: 'Fee Receipt', path: '/fee' }
      ],
      color: '#16a34a'
    },
    { id: 5, label: 'Enquiry', icon: Phone, path: '/enquiry', color: '#64748b' },
    { id: 6, label: 'Stock Management', icon: Inventory2, path: '/stock-management', color: '#0ea5e9' },
    { id: 7, label: 'Offline Job Applications', icon: ListAlt, path: '/offline-job-applications', color: '#3b82f6' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleMenuClick = (item) => {
    if (item.hasSubmenu) {
      setOpenSection((prev) => (prev === item.id ? null : item.id));
    } else {
      navigate(item.path);
    }
  };

  const handleSubClick = (path) => navigate(path);

  const drawerWidth = 256;
  const collapsedWidth = 80;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open
      className="h-full"
      style={{ width: isCollapsed ? collapsedWidth : drawerWidth, flexShrink: 0 }}
      PaperProps={{
        className: 'text-white h-full flex flex-col',
        style: {
          width: isCollapsed ? collapsedWidth : drawerWidth,
          overflowX: 'hidden',
          borderRight: '1px solid #0f172a',
          background:
            'linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(15,23,42,1) 40%, rgba(2,6,23,1) 100%)'
        }
      }}
    >
      <Toolbar className="!min-h-0 p-0">
        <Box className="w-full px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
          {!isCollapsed && (
            <Box className="flex items-center space-x-3">
              <Box className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">TB</span>
              </Box>
              <Typography className="font-bold text-lg tracking-wide">Target Board</Typography>
            </Box>
          )}
          <IconButton onClick={onToggle} className="text-white hover:bg-white/10">
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>
      </Toolbar>

      {!isCollapsed && (
        <Box className="px-4 py-3 border-b border-slate-700/60 text-center">
          <Typography className="text-sm text-white font-medium">
            Welcome: Target board jehanabad
          </Typography>
          <Typography className="text-xs text-slate-200 mt-1">{currentDate}</Typography>
        </Box>
      )}

      <List className="flex-1 overflow-y-auto p-2">
        {menuItems.map((item) => {
          const open = openSection === item.id;
          const ActiveIcon = item.icon;
          const selected = isActive(item.path);
          const ButtonContent = (
            <ListItemButton
              onClick={() => handleMenuClick(item)}
              selected={selected}
              className={`group rounded-xl my-1 !py-2.5 transition-colors duration-200 relative ${
                selected
                  ? 'text-white bg-emerald-600 shadow-lg ring-2 ring-emerald-400/50'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
              title={isCollapsed ? item.label : ''}
              style={{ borderLeft: `4px solid ${selected ? '#10b981' : 'transparent'}` }}
            >
              <ListItemIcon
                style={{ minWidth: isCollapsed ? 0 : 40 }}
                className={`!text-inherit ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Box className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                  selected ? 'bg-white/25 shadow-sm' : 'bg-white/5 group-hover:bg-white/15'
                }`}>
                  <ActiveIcon
                    className="text-current"
                    style={{ color: selected ? '#ffffff' : item.color }}
                  />
                </Box>
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    className: selected
                      ? 'text-white font-semibold tracking-wide'
                      : 'text-slate-200 group-hover:text-white font-medium tracking-wide'
                  }}
                />
              )}
              {!isCollapsed && item.hasSubmenu && (open ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          );
          return (
            <Box key={item.id}>
              {isCollapsed ? (
                <Tooltip title={item.label} placement="right">
                  <Box>{ButtonContent}</Box>
                </Tooltip>
              ) : (
                ButtonContent
              )}
              {!isCollapsed && item.hasSubmenu && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding className="ml-6">
                    {item.submenu.map((subItem, index) => {
                      const subSelected = isActive(subItem.path);
                      return (
                        <ListItemButton
                          key={index}
                          onClick={() => handleSubClick(subItem.path)}
                          selected={subSelected}
                          className={`${
                            subSelected
                              ? 'bg-emerald-600/90 text-white shadow-sm'
                              : 'text-slate-200 hover:text-white hover:bg-white/10'
                          } rounded-lg my-1 !py-2.5 ml-1`}
                        >
                          <ListItemText
                            primary={subItem.label}
                            primaryTypographyProps={{
                              className: subSelected
                                ? 'text-white text-sm font-medium'
                                : 'text-slate-200 group-hover:text-white text-sm'
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>

      <Divider className="border-slate-600/60" />
      <Box className="p-4">
        <ListItemButton onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <ListItemIcon style={{ minWidth: isCollapsed ? 0 : 40 }} className={`${isCollapsed ? 'justify-center' : ''}`}>
            <Logout className="text-white" />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText
              primary="LogOut"
              primaryTypographyProps={{ className: 'text-white font-semibold' }}
            />
          )}
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default AdminCenterSidebar;
