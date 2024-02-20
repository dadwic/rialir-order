import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Speed';
import LiraIcon from '@mui/icons-material/CurrencyLira';
import LocationIcon from '@mui/icons-material/LocationOn';
import ShoppingIcon from '@mui/icons-material/ShoppingCart';
import AccountIcon from '@mui/icons-material/AccountCircle';
import AddShoppingIcon from '@mui/icons-material/AddShoppingCart';

const iOS =
  typeof navigator !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

export default function Drawer() {
  const [state, setState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState(open);
  };

  return (
    <React.Fragment>
      <Fab
        size="large"
        color="primary"
        variant="extended"
        onClick={toggleDrawer(true)}
        sx={{
          display: { md: 'none' },
          position: 'fixed',
          bottom: 16,
          left: 16,
        }}
      >
        <MenuIcon sx={{ mr: 1 }} />
        باز کردن منو
      </Fab>
      <SwipeableDrawer
        anchor="left"
        open={state}
        disableDiscovery={iOS}
        disableBackdropTransition={!iOS}
        onClose={toggleDrawer(false)}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem href="/lir/">
              <ListItemButton>
                <ListItemIcon>
                  <LiraIcon />
                </ListItemIcon>
                <ListItemText primary="قیمت لحظه ای لیر" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem href="/account/">
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="پیشخوان حساب" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem href="/account/order/">
              <ListItemButton>
                <ListItemIcon>
                  <AddShoppingIcon />
                </ListItemIcon>
                <ListItemText primary="ثبت سفارش" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem href="/account/orders/">
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingIcon />
                </ListItemIcon>
                <ListItemText primary="لیست سفارش ها" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem href="/account/edit-address/">
              <ListItemButton>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText primary="آدرس ها" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem href="/account/edit-account/">
              <ListItemButton>
                <ListItemIcon>
                  <AccountIcon />
                </ListItemIcon>
                <ListItemText primary="جزئیات حساب" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem href={`/account/logout/?_wpnonce=${orderApi.nonce}`}>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="خروج" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </React.Fragment>
  );
}
