import axios from 'axios'
import config from '../config'

const client = axios.create({
  baseURL: config.music.endpoint
})

const API = {
  cache: {},

  ACCESS_TOKEN: null,
  loggedIn: () => {
    return !!API.ACCESS_TOKEN
  },

  request: (path, method) => {
    if (API.cache[path]) return API.cache[path]
    path = path.replace(/\/?$/, '/');
    console.info('requesting ', path, method)
    return client[method.toLowerCase()](path)
      .then(response => {
        const {data} = response
        API.cache[path] = data
        return data
      })
      .catch(response =>{
        const e = new Error()
        Object.assign(e, response.data)
        console.error(`Error getting path ${path}`)
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
  }
}

export default API
