import Cookie from 'js-cookie'
import { notify } from './logger'
import { alert } from './utils'


const debug = console.info
const debugMock = console.info
const getBadger = () => {
  return typeof window.$badger !== 'undefined' ? window.$badger : false
}

const MockBadger = {
  _launchCompleted: false,
  _resolveToken: false,
  _isGuest: false,
  _launchCompletedMetricSent: false,
  launchCompletedMetricsHandler () {
    const $badger = getBadger()
    if ($badger && !MockBadger._launchCompletedMetricSent) {
      debug('$badger.launchCompletedMetricsHandler')
      $badger.launchCompletedMetricsHandler()
      MockBadger._launchCompletedMetricSent = true
    } else {
      debug('$badger.launchCompletedMetricsHandler  - badger not ready, will try when badger loads')
      this._launchCompleted = true
    }
  },
  errorMetricsHandler: (message, visible, code, args) => {
    const $badger = getBadger()
    if ($badger) {
      debug('$badger.errorMetricsHandler(%s,%s,%s,%s)', message, visible, code, args)
      $badger.errorMetricsHandler(message, visible, `NPROne-${code}`, args)
      console.error('Error to badger ', message, code)
    } else {
      debugMock('$badger.errorMetricsHandler(%s,%s,%s,%s)', message, visible, code, JSON.stringify(args, null, 4))
    }
  },
  userActionMetricsHandler: (name, payload) => {
    const $badger = getBadger()
    if ($badger) {
      // debug('$badger.userActionMetricsHandler(%s): ', name, payload)
      $badger.userActionMetricsHandler(name, payload)
    } else {
      debugMock('$badger.userActionMetricsHandler(%s): ', name, payload)
    }
  },
  getAppAuth: () => {
    return {
      upsert: (userid, data) => {
        debug('Attempting upsert %s', this._isGuest, data)
        const $badger = getBadger()
        return new Promise(function (resolve) {
          if (MockBadger._isGuest) {// Don't store guest tokens.
            // debug('User is guest, do not upsert')
            return resolve(data)
          } else {
            // debug('User is not guest, upserting with ',userid, data)
          }
          Cookie.set('npr_accessToken', data, {expires: 365})
          Cookie.set('npr_userId', userid)
          resolve(data)
          if ($badger) {
            debug('Saving to $badger Auth Wallet', userid, data)
            $badger.getAppAuth().upsert(userid, {token: data})
              .success((data) => {
                debug('upsert response', data)
                resolve(data)
              })
              .failure((e) => {
                console.error('error saving app auth token', e.message)
              })
          }
        })
      },
      get: () => {
        return new Promise((resolve, reject) => {
          debug('Using cookie for access token')
          const data = Cookie.getJSON('amzn_music_auth')
          if (data) {
            debug('Got token from cookie.')
            resolve(data)
          } else {
            const path = window.location.pathname
            const err = new Error('no auth data in cookie')
            err.status = 401
            reject(err)
          }
        })
      },
      delete: () => {
        const $badger = getBadger()
        return new Promise((resolve, reject) => {
          debug('Deleting cookie')
          try {
            Cookie.remove('npr_accessToken')
            Cookie.remove('npr_userId')
            resolve()
          } catch (e) {
            debug('error deleting user data', e)
            reject(e)
          }
          if ($badger) {
            $badger.getAppAuth().delete()
              .success(() => {
                debug('Deleted User Auth data for badger')
                resolve()
              })
              .failure(e => {
                debug('error deleting auth data', e)
                reject(e)
              })
          }
        })
      }
    }
  },
  info: () => {
    return {
      zipcode: () => {
        const $badger = getBadger()
        if ($badger) {
          return new Promise((resolve, reject) => {
            $badger.info()
              .success(({zipcode}) => {
                debug('returning badger zip ' + zipcode)
                resolve(zipcode)
              })
              .failure(reject)
          })
        } else return Promise.resolve(null)
      }
    }
  },
  userPreferences: () => {
    return {
      promptSignInEmail: () => {
        const $badger = getBadger()
        if ($badger) {
          return new Promise((resolve, reject) => {
            $badger.userPreferences().promptSignInEmail()
              .success(payload => {
                alert('Real Badger Payload', JSON.stringify(payload, null, 4), payload)
                  .then(resolve)
              })
              .failure(reject)
          })
        }
        else {
          return alert('Fake Badger Email Prompt', 'No Email', {
            status: 'NEW_EMAIL',
            // status: 'SUCCESS',
            data: {
              email: 'x1partnerade@comcast.net'
            }
          })
          // return alert('Fake Badger Email Prompt', 'Using email x1partnerade@comcast.net', {
          //   status: 'SUCCESS',
          //   data: {
          //     email: 'x1partnerade@comcast.net'
          //   }
          // })
        }
      }
    }
  },
  shutdown: () => {
    const $badger = getBadger()
    if ($badger) $badger.shutdown()
    else {
      debug('____EXITING____')
    }
  }
}

document.addEventListener('onMoneyBadgerReady', () => {
  console.info(`onMoneyBadgerReady ${MockBadger._launchCompleted}`)
  if (MockBadger._launchCompleted) {
    debug('$badger.launchCompletedMetricsHandler')
    MockBadger.launchCompletedMetricsHandler()
  }
})
export default MockBadger
