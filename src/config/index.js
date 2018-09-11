const CONFIG = {
  linking: {
    client_id: process.env.REACT_APP_AMAZON_MUSIC_CLIENT_ID,
    code_id: process.env.REACT_APP_AMAZON_CODE_CLIENT_ID,
    serial_number: process.env.REACT_APP_SERIAL_NUMBER,
    scope: 'amazon_music:access'
  },
  player: {
    heartbeat_frequency: 3000,
    timeout_check_frequency: 5000,
    disable_time_updates: false
  },
  music: {
    endpoint: process.env.REACT_APP_MUSIC_ENDPOINT || 'https://music-api.amazon.com',
    browse_node: '/widescreen_catalog/',
    recent_node: '/widescreen_recents/',
    my_music_node: '/widescreen_library/',
    search: '/wisescreen_search/'
  }
}

export default CONFIG