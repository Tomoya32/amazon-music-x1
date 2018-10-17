import axios from 'axios'
import config from '../config'

const client = axios.create({
  baseURL: config.music.base_url
})

const API = {
  cache: {},

  ACCESS_TOKEN: null,
  loggedIn: () => {
    return !!API.ACCESS_TOKEN
  },

  request: (path, method) => {
    path = path.replace(/\/?$/, '/');
    console.info('requesting ', path, method)
    return client[method.toLowerCase()](path)
      .then(response => response)
      .catch(request => {
        const {response} = request
        const e = new Error(response.statusText)
        Object.assign(e, {data: response.data, status: response.status})
        if(e.status === 401 || e.status === 403) API.deleteToken()
        console.error(`Error getting path ${path}`, e)
        throw(e)
      })
  },


  loadNavigationNode: (path = '/') => {
    return API.request(path, 'get')
  },


  setToken: (token) => {
    console.info('Setting access token  to ', token)
    // get it now, track changes
    API.ACCESS_TOKEN = token
    client.defaults.headers.common['Authorization'] = `Bearer ${API.ACCESS_TOKEN}`
  },
  deleteToken: () => {
    API.ACCESS_TOKEN = null
  }
}

export default API
