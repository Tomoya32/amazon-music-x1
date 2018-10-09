const CONFIG = {
  linking: {
    base_url: process.env.REACT_APP_AMAZON_API_BASE_URL || 'http://localhost:9000',
    scope: 'amazon_music:access'
  },
  player: {
    heartbeat_frequency: 3000,
    timeout_check_frequency: 5000,
    disable_time_updates: false
  },
  music: {
    base_url: process.env.REACT_APP_AMAZON_MUSIC_BASE_URL || 'https://music-api.amazon.com',
    browse_node: '/widescreen_catalog/',
    recent_node: '/widescreen_recents/',
    my_music_node: '/widescreen_library/',
    search: '/wisescreen_search/'
  },
  auth: {
    endpoint: `${process.env.REACT_APP_AMAZON_API_BASE_URL}/auth/O2/` || 'https://api.amazon.com/auth/O2/'
  },
  errorModalTimeout: 5000
}

export default CONFIG