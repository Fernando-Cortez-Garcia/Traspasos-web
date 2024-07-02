import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const settings = ["Salir"];
function ResponsiveAppBar() {
  //declaracion de variables
  const [name, setName] = React.useState("");
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate(); // Hook para redireccionar

  //funciones
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logOut = () => {
    localStorage.removeItem("user");
    navigate("login");
  };

  const toSentenceCase = (str) => {
    return str.replace(
      /\w\S*/g,
      function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
  );
}

  //init
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setName(userObj.nombre);
    }
  });

  return (
    <AppBar
      position="static"
      className="mb-5"
      sx={{ backgroundColor: "#ff4141" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              color: "white",
            }}
          >
            TRASPASOS HIDALGO
          </Typography>

          <Typography
            variant="body1"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              color: "white",
              fontSize: "0.875rem",
            }}
          >
            TRASPASOS HIDALGO
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, color: "white" }}
              >
                <Typography
                  variant="body1"
                  noWrap
                  component="div"
                  className="me-1"
                >
                  {toSentenceCase(name)}
                </Typography>

                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={logOut}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
