
export function isValidUrl(value){
  if(!value || typeof value !== 'string') return false
  try{
    const url = new URL(value.startsWith('http') ? value : 'https://' + value)
    return true
  }catch(e){
    return false
  }
}
