
import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { shorten } from '../api'
import { logEvent } from '../logger'
import { isValidUrl } from '../utils/validateUrl'

export default function ShortenerPage(){
  const empty = { url: '', validity: '' }
  const [rows, setRows] = useState([empty, empty, empty, empty, empty])
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const update = (i, key, value) => {
    const copy = [...rows]; copy[i] = {...copy[i], [key]: value}; setRows(copy)
  }

  const submit = async () => {
    setError('')
    const filled = rows.filter(r=>r.url && r.url.trim())
    if(filled.length === 0){ setError('Enter at least one URL'); return }
    for(const f of filled){
      if(!isValidUrl(f.url)){ setError('One or more URLs are invalid'); logEvent({stack:'Shortener', level:'error', package:'affordmed-frontend', message:'Invalid URL entered'}); return }
      if(f.validity && isNaN(Number(f.validity))){ setError('Validity must be number'); return }
    }
    const payload = { urls: filled.map(f => ({ longUrl: f.url, validityMinutes: f.validity ? Number(f.validity) : null })) }
    setLoading(true)
    try{
      const r = await shorten(payload)
      const data = r.data?.results || r.data || []
      setResults(data)
      logEvent({ stack: 'Shortener', level: 'info', package: 'affordmed-frontend', message: `Shortened ${data.length} URLs` })
    }catch(e){
      setError('Shorten failed: ' + (e?.response?.data?.message || e.message))
      logEvent({ stack: 'Shortener', level: 'error', package: 'affordmed-frontend', message: 'Shorten API failed' })
    }finally{ setLoading(false) }
  }

  const copy = (text) => navigator.clipboard.writeText(text)

  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h6">URL Shortener (up to 5 URLs)</Typography>
      <Stack spacing={2} sx={{ mt:2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          {rows.map((r, i) => (
            <Grid item xs={12} key={i}>
              <Stack direction="row" spacing={2}>
                <TextField fullWidth label={`Long URL ${i+1}`} value={r.url} onChange={(e)=>update(i,'url',e.target.value)} />
                <TextField sx={{ width:160 }} label="Validity (minutes)" value={r.validity} onChange={(e)=>update(i,'validity',e.target.value)} />
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={submit} disabled={loading}>{loading ? 'Shortening...' : 'Shorten'}</Button>
          <Button variant="outlined" onClick={()=>{ setRows([empty, empty, empty, empty, empty]); setResults([]); setError('') }}>Reset</Button>
        </Stack>

        {results && results.length>0 && (
          <>
            <Typography variant="subtitle1">Results</Typography>
            <Table>
              <TableHead>
                <TableRow><TableCell>Original</TableCell><TableCell>Short</TableCell><TableCell>Expiry</TableCell><TableCell>Action</TableCell></TableRow>
              </TableHead>
              <TableBody>
                {results.map((it, idx)=>(
                  <TableRow key={idx}>
                    <TableCell>{it.original || it.longUrl || it.originalUrl}</TableCell>
                    <TableCell><a href={it.short || it.shortUrl} target="_blank" rel="noreferrer">{it.short || it.shortUrl}</a></TableCell>
                    <TableCell>{it.expiry || it.expiresAt || '-'}</TableCell>
                    <TableCell><IconButton onClick={()=>copy(it.short || it.shortUrl)}><ContentCopyIcon /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Stack>
    </Paper>
  )
}
