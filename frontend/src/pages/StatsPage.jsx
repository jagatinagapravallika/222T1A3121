
import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { myUrls } from '../api'
import { logEvent } from '../logger'

export default function StatsPage(){
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const load = async ()=>{
    setError('')
    try{
      const r = await myUrls()
      const data = r.data?.results || r.data || []
      setItems(data)
      logEvent({ stack:'Stats', level:'info', package:'affordmed-frontend', message:'Fetched URL stats' })
    }catch(e){
      setError('Failed to load stats: ' + (e?.message || 'error'))
      logEvent({ stack:'Stats', level:'error', package:'affordmed-frontend', message:'Failed to fetch stats' })
    }
  }

  useEffect(()=>{ load() }, [])

  return (
    <Paper sx={{ p:3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Your URLs / Stats</Typography>
        <Button variant="outlined" onClick={load}>Refresh</Button>
      </Stack>

      {error && <Typography color="error">{error}</Typography>}

      <Table>
        <TableHead>
          <TableRow><TableCell>Original</TableCell><TableCell>Short</TableCell><TableCell>Clicks</TableCell><TableCell>Expiry</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {items.length===0 && <TableRow><TableCell colSpan={4}>No URLs yet</TableCell></TableRow>}
          {items.map((it, idx)=>(
            <TableRow key={idx}>
              <TableCell>{it.original || it.longUrl}</TableCell>
              <TableCell><a href={it.short || it.shortUrl} target="_blank" rel="noreferrer">{it.short || it.shortUrl}</a></TableCell>
              <TableCell>{it.clicks ?? it.count ?? 0}</TableCell>
              <TableCell>{it.expiry || it.expiresAt || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
