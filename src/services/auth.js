import axios from 'axios'
import CONFIG from '../config'

export const PAIRING_ENDPOINT = 'https://api.amazon.com/auth/O2/'

const client = axios.create({
  baseURL: PAIRING_ENDPOINT,
  headers: {
    'Accept-Language': 'en-US',
    'Content-Type': 'application/json'
  }
})

export const getCode = () => {
  return client.post('create/codepair', {
    response_type: 'device_code',
    client_id: CONFIG.linking.client_id,
    scope: CONFIG.linking.scope,
    scope_data: {
      [CONFIG.linking.scope]: {
        productID: 'AmazonX1',
        productInstanceAttributes: {
          deviceSerialNumber: CONFIG.linking.serial_number
        }
      }
    }
  })
    .then(({data}) => data)
}

const poll = (device_code, user_code) => {
  return client.post('token', {
    device_code, user_code,
    grant_type: 'device_code'
  })
    .then(({data}) => data)
    .catch(({data}) => data)
}

class Poller {
  static default_interval = 3000
  cancel() {
    if(this.polling) clearInterval(this.polling)
    if(this.reject) this.reject({
      error: 'canceled',
      error_description: 'polling has been canceled'
    })
    this.reject = null
  }
  getPollResult ({device_code, expires_in, user_code}) {
    if (this.polling) clearInterval(this.polling)
    this.interval = Poller.default_interval
    return new Promise((resolve, reject) => {
      this.reject = reject
      this.polling = setInterval(() => {
        poll(device_code, user_code)
          .then(payload => {
            this.reject = null
            return payload
          })
          .catch(({error}) => {
            switch(error) {
              case 'authorization_pending':
              case 'slow_down': // Need to figure out how to manage this.
                return true
              default:
                console.error('Error with polling, cancel and restart')
                clearInterval(this.polling)
                reject(error)
            }
          })
      }, this.interval)
    })
  }
}

export const poller = new Poller()
export const pollForCode = (config) => {
  return poller.getPollResult(config)
}

export const cancelPoller = () => {
  poller.cancel()
}