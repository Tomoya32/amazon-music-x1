const CONFIG = {
  linking: {
    client_id: process.env.REACT_APP_AMAZON_MUSIC_CLIENT_ID,
    serial_number: process.env.REACT_APP_SERIAL_NUMBER,
    scope: 'amazon_music:access'
  },

  music: {
    endpoint: process.env.REACT_APP_MUSIC_ENDPOINT || 'https://music-api.amazon.com'
  }
}

console.log('linking with client ID:', process.env.REACT_APP_AMAZON_MUSIC_CLIENT_ID)
console.log('linking with serial number:', process.env.REACT_APP_SERIAL_NUMBER)

export default CONFIG