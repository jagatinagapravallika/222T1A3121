
import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { register, authToken } from '../api'
import { logEvent } from '../logger'
import { useNavigate } from 'react-router-dom'

export default function LoginPage(){
  const [roll, setRoll] = useState('')
  const [email, setEmail] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError('')
    if(!roll || !email){ setError('Roll and Email required'); return }
    setLoading(true)
    try{
      const r = await register({ email:'jagatinagapravallika@gmail.com',name:"Naga Pravallika", rollNo:"222T1A3121", mobileNo:"9014058097", githubUsername: "jagatinagapravallika", accessCode:"SpPpgZ" })
      const data = r.data || {}
      const cid = data.clientId || data.client_id
      const csecret = data.clientSecret || data.client_secret
      if(cid && csecret){
        setClientId(cid); setClientSecret(csecret)
      }
      logEvent({ stack: 'Registration', level: 'info', package: 'frontend', message: 'Registration request sent' })
    }catch(e){
      setError('Registration failed: ' + (e?.response?.data?.message || e.message))
      logEvent({ stack: 'Registration', level: 'error', package: 'frontend', message: 'Registration failed' })
    }finally{ setLoading(false) }
  }

  const handleAuth = async () => {
    setError(''); setLoading(true)
    try{
      const r = await authToken({ email:'jagatinagapravallika@gmail.com',name:"Naga Pravallika", rollNo:"222T1A3121", accessCode:"SpPpgZ", clientId: clientId, clientSecret: clientSecret })
      const token = r.data?.access_token || r.data?.token || r.data?.accessToken
      if(!token) throw new Error('No token in response')
      localStorage.setItem('access_token', token)
      localStorage.setItem('user_roll', roll)
      logEvent({ stack: 'Auth', level: 'info', package: 'frontend', message: 'Auth token obtained' })
      navigate('/shorten')
    }catch(e){
      setError('Auth failed: ' + (e?.response?.data?.message || e.message))
      logEvent({ stack: 'Auth', level: 'error', package: 'frontend', message: 'Auth failed' })
    }finally{ setLoading(false) }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Register / Authenticate</Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Roll Number" value={roll} onChange={(e)=>setRoll(e.target.value)} />
        <TextField label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Button variant="contained" onClick={handleRegister} disabled={loading}>Register</Button>

        <Typography variant="subtitle2">If your registration returned clientId/clientSecret, paste them here to obtain token</Typography>
        <TextField label="Client ID" value={clientId} onChange={(e)=>setClientId(e.target.value)} />
        <TextField label="Client Secret" value={clientSecret} onChange={(e)=>setClientSecret(e.target.value)} />
        <Button variant="contained" onClick={handleAuth} disabled={loading}>Get Token</Button>
      </Stack>
    </Paper>
  )
}
