import parseMs from 'parse-ms'
import addZero from 'add-zero'
import config from './config'
import qs from 'query-string'
import ru from 'resolve-pathname'
import uj from 'url-join'
import uparse from 'url-parse'
import querystring from 'querystring'


export function getParam (param) {
  const parsed = qs.parse(document.location.search)
  if (parsed && parsed[param]) return parsed[param]
  else return undefined
}

const debug = console.info

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

export function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

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



export function handleItemSelection(selected, enclosingPath = '') {
  if (!selected.navigationNodeSummary && selected.playable) {
    const {itemDescriptions, playables} = this.props
    const item = itemDescriptions[noha(selected.ref)]
    const playable = playables[noha(item.playable)]
    console.info('here', enclosingPath, item.playable)
    const dest = mergeChunkWithPathAndQuery(['/playback', enclosingPath], playable.naturalTrackPointer.chunk, {indexWithinChunk: playable.naturalTrackPointer.indexWithinChunk} )
    this.props.replace(dest)

  } else if(selected.navigationNodeSummary) {
    const {navigationNodeSummaries} = this.props
    const navNode = navigationNodeSummaries[noha(selected.navigationNodeSummary)]
    const listDest = mergePath('/list', enclosingPath, navNode.description)
    this.props.replace(listDest)
  } else {
    console.error('got invalid selected', selected)
  }
}

export function mergePath () {
  if(!arguments.length) return ''
  const args =  Array.prototype.slice.call(arguments)
  if(!args && !args.length) return ''
  let joined = uj.call(null, args.filter(a => !!a))
  joined = ru(joined)
  return joined.replace(/.*\/\/[^/]*/, '')
}

export function getLocation(href) {
  var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
  return match && {
    href: href,
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7]
  }
}
/**
 *
 */
export function mergeChunkWithPathAndQuery(path, chunk, query = {}) {
  if(Array.isArray(path)) path = mergePath.apply(null, path)
  const qs = typeof query === 'object' ?  query : querystring.parse(query.replace(/^\?+/, ''))
  const destPath = mergePath(path, chunk)
  const href = uparse(destPath)
  const parsed = querystring.parse(href.query)
  const combined = Object.assign(qs, parsed)
  const out =  `${href.pathname}?${querystring.stringify(combined)}${href.hash}`
  return out
}

export function parseAPIPath(path) {
  if(!path) return null
  const resolved = ru(path)
  const {pathname, hash} = uparse(resolved)
  return {pathname, hash}
}
export function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}
