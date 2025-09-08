
import api, { postLog } from './api'

export async function logEvent(entry){
  try{
    
    if(!entry || !entry.stack || !entry.level || !entry.message) return
    await postLog(entry)
  }catch(e){
    console.log(e)
  }
}


function attachAutoLogging(){
  
  api.interceptors.request.use(config => {
    
    if(config.headers && config.headers['X-Skip-Logging'] === 'true') return config
    const entry = {
      stack: config.url || 'request',
      level: 'info',
      package: 'affordmed-frontend',
      message: `Request: ${config.method?.toUpperCase()} ${config.url}`
    }
    
    postLog(entry).catch(()=>{})
    return config
  })

  
  api.interceptors.response.use(response => {
    const config = response.config
    if(config.headers && config.headers['X-Skip-Logging'] === 'true') return response
    const entry = {
      stack: config.url || 'response',
      level: 'info',
      package: 'affordmed-frontend',
      message: `Response ${response.status} for ${config.method?.toUpperCase()} ${config.url}`
    }
    postLog(entry).catch(()=>{})
    return response
  }, error => {
    const config = error.config || {}
    if(config.headers && config.headers['X-Skip-Logging'] === 'true') return Promise.reject(error)
    const entry = {
      stack: config.url || 'response_error',
      level: 'error',
      package: 'affordmed-frontend',
      message: `Error for ${config.method?.toUpperCase()} ${config.url}: ${error.message}`
    }
    postLog(entry).catch(()=>{})
    return Promise.reject(error)
  })
}


attachAutoLogging()
