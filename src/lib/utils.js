import parseMs from 'parse-ms'
import addZero from 'add-zero'
import debugWrapper from 'debug'
import config from '../config'
import qs from 'query-string'

export function getParam (param) {
  const parsed = qs.parse(document.location.search)
  if (parsed && parsed[param]) return parsed[param]
  else return undefined
}

const debug = debugWrapper('app:utils')

export function secondsToHms (d) {
  d = Number(d)
  var h = Math.floor(d / 3600)
  var m = Math.floor(d % 3600 / 60)
  var s = Math.floor(d % 3600 % 60)
  var msStr = `00${m}`.slice(-2) + ':' + `00${s}`.slice(-2)
  return (h === 0) ? msStr : `00${h}`.slice(-2) + ':' + msStr
}


export function alert (title, text, payload) {
  if (!config.enableAlerts) return Promise.resolve(payload)
  return new Promise(resolve => {
    const div = document.createElement('div')
    div.style.cssText = `background: black; color: white; width: 600px; height: 200px; position; border: 5px solid gray; padding: 20px; text-align: center; position: absolute; left: 310px; top: 200px`
    div.innerHTML = `<h3>${title}</h3><pre>${text}</pre>`
    document.getElementById('root').appendChild(div)
    setTimeout(() => {
      document.getElementById('root').removeChild(div)
      resolve(payload)
    }, 3000)
  })
}

export const noha = str => typeof(str) === 'string' ? str.replace(/^#/,'') : str
export const perha = str => typeof(str) === 'string' ?  str.replace(/^#/,'$') : str
export const haper = str => typeof(str) === 'string' ?  str.replace(/^\$/,'#') : str

// export function isNumeric (n) {
//   return !isNaN(parseFloat(n)) && isFinite(n)
// }

export function formatDuration (ms) {
  let {days, hours, minutes, seconds} = parseMs(ms)
  seconds = addZero(seconds)
  if (days) return `${days}:${addZero(hours)}:${addZero(minutes)}:${seconds}`
  if (hours) return `${hours}:${addZero(minutes)}:${seconds}`
  return `${minutes}:${seconds}`
}

export function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function fancyTimeFormat (str) {
  const sec_num = parseInt(str, 10) // don't forget the second param

  let hours = Math.floor(sec_num / 3600)
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
  let seconds = sec_num - (hours * 3600) - (minutes * 60)
  if (hours < 10) hours = '0' + hours
  if (minutes < 10) minutes = '0' + minutes
  if (seconds < 10) seconds = '0' + seconds

  let out = [minutes, seconds]
  if (hours.toString() !== '00') out.unshift(hours)

  return out.join(':')
}

export function makeid (len = 5) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  while (text.length < len) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

export function shallowEqual (objA, objB) {
  if (objA === objB) {
    return true
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    //console.warn(`[DIRTY] typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null`, objA, objB)
    return false
  }

  var keysA = Object.keys(objA)
  var keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    console.warn(`[DIRTY] keys length difference`, keysA, keysB)

    return false
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB)
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      console.warn(`[DIRTY] Key Diff `, keysA[i], objA[keysA[i]], objB[keysA[i]])
      return false
    }
  }

  return true
}

export function proxyMediaUrl (src) {
  debug('proxyMediaUrl', process.env.NPR_ONE_PROXY_MEDIA_URL, src)
  return (process.env.NPR_ONE_PROXY_MEDIA_URL) ? `${process.env.NPR_ONE_PROXY_MEDIA_URL}?url=${src}` : src
}
