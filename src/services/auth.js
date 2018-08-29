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

const poll = (device_code, user_code) => {
  return client.post('token', {
    device_code, user_code,
    grant_type: 'device_code'
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      const e = new Error()
      e.data = error.response.data
      throw(e)
    })
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
        // See results and info at
        // https://developer.amazon.com/docs/alexa-voice-service/code-based-linking-other-platforms.html
        poll(device_code, user_code)
          .then(payload => {
            this.reject = null
            resolve(payload)
          })
          .catch(e => {
            const {error} = e.data
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

export const authWrapper = connectedRouterRedirect({
  // The url to redirect user to if they fail
  redirectPath: '/linking',
  // If selector is true, wrapper will not redirect
  // For example let's check that state contains user data
  authenticatedSelector: state => state.auth.access_token !== null,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsAuthenticated'
})
const locationHelper = locationHelperBuilder({})
export const userIsNotAuthenticated = connectedRouterRedirect({
  // This sends the user either to the query param route if we have one, or to the landing page if none is specified and the user is already logged in
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
  // This prevents us from adding the query parameter when we send the user away from the login page
  allowRedirectBack: false,
  // If selector is true, wrapper will not redirect
  // So if there is no user data, then we show the page
  authenticatedSelector: state => state.auth.access_token === null,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsNotAuthenticated'
})
