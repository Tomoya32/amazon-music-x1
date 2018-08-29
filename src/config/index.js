const CONFIG = {
  linking: {
    client_id: process.env.REACT_APP_AMAZON_MUSIC_CLIENT_ID,
    serial_number: process.env.REACT_APP_SERIAL_NUMBER,
    // scope: 'amazon_music:access'
    scope: 'alexa:all'
  }
}

export default CONFIG