
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import NavBar from './components/NavBar'
import LoginPage from './pages/LoginPage'
import ShortenerPage from './pages/ShortenerPage'
import StatsPage from './pages/StatsPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <>
      <NavBar />
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>AffordMed - URL Shortener (Frontend)</Typography>
          <Routes>
            <Route path='/' element={<Navigate to='/shorten' replace />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/shorten' element={<ProtectedRoute><ShortenerPage /></ProtectedRoute>} />
            <Route path='/stats' element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Box>
      </Container>
    </>
  )
}
