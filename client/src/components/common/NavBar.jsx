import React, {useState} from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Box,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
    Avatar,
    useTheme,
    useMediaQuery,
    Badge,
    Typography
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home,
    Search,
    Assignment,
    Favorite,
    Business,
    Person,
    Logout
} from '@mui/icons-material';
import {useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';
import {useNotifications} from '../../hooks/useNotifications';
import logoSvg from '/logo/logo.svg';

export default function NavBar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const {user, logout} = useAuth();
    const {unreadCount, markAllAsRead, resetUnreadCount} = useNotifications();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/auth');
        } catch (error) {
            // Handle error silently
        }
    };

    const handleRequestsClick = async () => {
        // Mark all as read when user clicks on requests (only for owners)
        if (user?.role === 'owner' && unreadCount > 0) {
            try {
                await markAllAsRead();
                resetUnreadCount();
            } catch (error) {
                // Handle error silently
            }
        }
        navigate('/requests');
    };

    const navigationItems = [
        {label: 'Home', path: '/home', icon: <Home/>},
        {label: 'Search', path: '/search', icon: <Search/>},
        {
            label: 'Requests',
            path: '/requests',
            icon: user?.role === 'owner' && unreadCount > 0 ? (
                <Badge badgeContent={unreadCount} color="error">
                    <Assignment/>
                </Badge>
            ) : <Assignment/>,
            onClick: handleRequestsClick
        },
        {label: 'Favourites', path: '/favourites', icon: <Favorite/>},
        ...(user?.role === 'owner' ? [{label: 'My Venues', path: '/my-venues', icon: <Business/>}] : [])
    ];

    const isActive = (path) => location.pathname === path;

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <Box sx={{py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={logoSvg} alt="RentEvent" height="32"/>
            </Box>
            <Divider/>
            <List>
                {navigationItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
                            selected={isActive(item.path)}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255, 224, 71, 0.1)',
                                    borderRight: '4px solid',
                                    borderColor: 'secondary.main',

                                }
                            }}
                        >
                            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                {React.cloneElement(item.icon, {sx: {mr: 2}})}
                                <ListItemText primary={item.label}/>
                            </Box>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar position="sticky" elevation={2}>
            <Toolbar sx={{px: {xs: 2, sm: 3, md: 4}}}>
                {/* Logo */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        mr: 'auto'
                    }}
                    onClick={() => navigate('/home')}
                >
                    <img
                        src={logoSvg}
                        alt="RentEvent"
                        height="40"
                    />
                </Box>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        {navigationItems.map((item) => (
                            <Button
                                key={item.path}
                                color="inherit"
                                onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
                                startIcon={item.icon}
                                sx={{
                                    px: 2,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: isActive(item.path) ? '80%' : '0%',
                                        height: '3px',
                                        backgroundColor: 'secondary.main',
                                        transition: 'width 0.3s ease'
                                    },
                                    '&:hover::after': {
                                        width: '80%'
                                    }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                )}

                {/* Profile Menu */}
                <Box sx={{ml: 'auto'}}>
                    <IconButton
                        onClick={handleProfileMenuOpen}
                        sx={{
                            p: 0.5,
                            border: '2px solid transparent',
                            '&:hover': {
                                borderColor: 'secondary.main',
                            }
                        }}
                    >
                        <Avatar sx={{width: 36, height: 36, bgcolor: 'secondary.main', color: 'primary.main'}}>
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        sx={{
                            mt: 1,
                            '& .MuiPaper-root': {
                                minWidth: 200
                            }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Signed in as
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {user?.name} {user?.surname}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.role === 'owner' ? 'Venue Owner' : 'Event Organizer'}
                            </Typography>
                        </Box>
                        <Divider />

                        <MenuItem sx={{mt: 1}} onClick={() => {
                            handleProfileMenuClose();
                            navigate('/profile');
                        }}>
                            <Person sx={{mr: 2}}/>
                            Profile
                        </MenuItem>

                        <Divider/>
                        <MenuItem onClick={() => {
                            handleProfileMenuClose();
                            handleLogout();
                        }}>
                            <Logout sx={{mr: 2}}/>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>

                {/* Mobile menu button */}
                {isMobile && (
                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ml: 1}}
                    >
                        <MenuIcon/>
                    </IconButton>
                )}
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: {xs: 'block', md: 'none'},
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 280,
                        backgroundColor: 'primary.main',
                        color: 'white',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
}