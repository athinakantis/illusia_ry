import { Box, Button, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Logout from "../Auth/LoginOutBtn";

const PersonMenu = () => {
  // ─── profile menu state ──────────────────────────────────────────────
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuth();
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            '& a': {
              p: 0.5,
              borderRadius: '3px',
              transition: 'background-color 200ms',
              display: 'inline-flex',
              minWidth: 'fit-content',
              color: '#2c2c2c'
            },
            '& .MuiIconButton-root': {
             p: 0.5,
             borderRadius: '3px',
             transition: 'background-color 200ms',
             color: '#2c2c2c',
           },
           '& .MuiIconButton-root:hover': {
             backgroundColor: 'background.verylightgrey',
           },
            '& a:hover': { bgcolor: 'background.verylightgrey' },
            '& .logInOut': {
              textTransform: 'uppercase',
              fontSize: '0.875rem',
              fontWeight: 500,
              fontFamily: 'Roboto, sans-serif',
              textDecoration: 'none',
              color: 'primary.light',
              p: '6px 8px'
            }
          }}>
        <IconButton
        aria-label="Open profile menu"
        onClick={handleMenuOpen}
        size="small"
      >
        <PersonIcon />
        </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem component={Link} to="/bookings" onClick={handleMenuClose}>
              My bookings
            </MenuItem>
            <Divider />
            <MenuItem component={Link} to="/account" onClick={handleMenuClose}>
              My account
            </MenuItem>
            <Divider />
            <MenuItem disableRipple sx={{ pl: 2, pr: 2 }}>
            <Logout />({user?.email})
            </MenuItem>
            <Divider />
            {/* language buttons */}
            <Box sx={{ display: 'flex', gap: 1, p: 1, justifyContent: 'center' }}>
                <Button variant="outlined" size="small" color="primary" sx={{ padding: '4px 10px' }}>
                  En
                </Button>
                <Button variant="outlined" size="small" color="primary" sx={{ padding: '4px 10px' }}>
                  Fin
                </Button>
            </Box>
          </Menu>
        </Box>
    );
  };

export default PersonMenu;
