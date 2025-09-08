
import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Link, useNavigate } from 'react-router-dom'

export default function NavBar(){
  const token = localStorage.getItem('access_token')
  const navigate = useNavigate()
  const logout = () => { localStorage.removeItem('access_token'); localStorage.removeItem('user_roll'); navigate('/login') }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AffordMed
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" component={Link} to="/shorten">Shorten</Button>
          <Button color="inherit" component={Link} to="/stats">Stats</Button>
          {token ? <Button color="inherit" onClick={logout}>Logout</Button> : <Button color="inherit" component={Link} to="/login">Login</Button>}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
