import axios from 'axios'
import CONFIG from '../config'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'

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

class Poller {
  static default_interval = 3000

  cancel () {
    if (this.reject) this.reject({
      error: 'canceled',
      error_description: 'polling has been canceled'
    })
    this.donePolling()
  }

  donePolling(error = false) {
    console.info(`ending poll loop due to ${error ? 'error':'success'}`)
    clearTimeout(this.polling)
    this.reject = null
    this.pollrequest = null
  }

  poll (device_code, user_code, interval, resolve, reject) {
    console.info('polling', interval)
    return client.post('token', {
      device_code, user_code,
      grant_type: 'device_code'
    })
      .then(response => {
        resolve(response.data)
        this.donePolling()
        return 'resolved'
      })
      .catch(error => {
        const {data} = error.response
        switch (data.error) {
          case 'slow_down': // Need to figure out how to manage this.
            interval += interval
          case 'authorization_pending':
            clearTimeout(this.polling) // don't stack these
            this.polling = setTimeout(() => {
              this.poll(device_code, user_code, interval, resolve, reject)
            }, 3000) // Switch this to use internval
            break
          default:
            console.error('Error with polling, cancel and (maybe) restart')
            this.donePolling(true)
            this.reject(error)
        }
      })
  }

  getPollResult ({device_code, expires_in, user_code, interval = Poller.default_interval}) {
    return new Promise((resolve, reject) => {
      this.reject = reject
      // See results and info at
      // https://developer.amazon.com/docs/alexa-voice-service/code-based-linking-other-platforms.html
      if (this.pollrequest) return this.pollrequest // Don't stack responses.
      this.reject = reject // used for canceling
      this.pollrequest = this.poll(device_code, user_code, interval, resolve, reject)
    })
  }
}

export const poller = new Poller()
export const pollForCode = (config) => {
  return poller.getPollResult(config)
}

const refresh = (refresh_token) => {
  return client.post('token', {
    refresh_token,
    grant_type: 'refresh_token',
    client_id: CONFIG.linking.client_id
  })
    .then(response => {
      return response.data
    })
}

export const refreshToken = ({refresh_token, expires_in}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      refresh(refresh_token)
        .then(resolve)
        .catch(reject)
    }, expires_in - 3590)
  })
}

export const cancelPoller = () => {
  poller.cancel()
}

export const authWrapper = connectedRouterRedirect({
  redirectPath: '/linking',
  authenticatedSelector: state => state.auth.access_token !== null,
  wrapperDisplayName: 'UserIsAuthenticated'
})
const locationHelper = locationHelperBuilder({})
export const userIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false,
  authenticatedSelector: state => state.auth.access_token === null,
  wrapperDisplayName: 'UserIsNotAuthenticated'
})
