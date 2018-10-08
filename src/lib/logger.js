// Mock Logger
import $badger from './badger'


const debug = console.info

export function logError (e) {
  console.error('error', e)
}

export function trackNavigationEvent (location) {
  debug('logging navigation event', location)
  $badger.userActionMetricsHandler('location', {path: location})
}

export function trackNewRecommendation (payload) {
  debug(`Tracking new Recommendation %s`, payload.title)
  $badger.userActionMetricsHandler('recommendation', {title: payload.title, uid: payload.uid})
}
