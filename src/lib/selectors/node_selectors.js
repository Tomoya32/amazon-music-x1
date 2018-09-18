import { createSelector } from 'reselect'
import { noha } from '../utils'
import config from '../../config/index'
import {mergePath} from '../utils'
import up from 'url-parse'

const getKey = state => {
  const {pathname} = state.router.location
  let key = pathname.replace(/^\/(list|music)\/*/, '/')
  return ((key === '' || key === '/') && /^\/?music(\/|$)/.test(pathname))
    ? config.music.browse_node : key === '' ? '/' : key
}

const getNodeSegment = (state, item) => {
  const key = getKey(state)
  const node = state.music.nodes[key]
  if (!node) return node
  else return node[item]
}
const getNodes = state => state.music.nodes

const getItemDescriptions = state => getNodeSegment(state, 'itemDescriptions')
const getNavigationNodeDescriptions = state => getNodeSegment(state, 'navigationNodeDescriptions')
const getNavigationNodeSummaries = state => getNodeSegment(state, 'navigationNodeSummaries')
const getPlayables = state => getNodeSegment(state, 'playables')
const getResult = state => getNodeSegment(state, 'result')
const getHash = state => state.router.location.hash
const getNavigationNodeDescription = (state, {navigationNode}) => {
  const node = getNavigationNodeDescriptions(state)
  return node[navigationNode]
}
const getNavigationNodeSummary= (state, props) => {
  const summary = props.navigationNodeSummary ||  props.itemDescription.navigationNodeSummary
  if(!summary) return null
  const nodes = getNavigationNodeSummaries(state)
  const result = nodes[noha(summary)]
  return result
}


export const getNavigationNodeSelector = createSelector([getNavigationNodeDescription], node => node)
export const getPlayableSelector = createSelector([getPlayables], (playables) => playables)
export const getItemDescriptionsSelectors = createSelector([getItemDescriptions], (items) => items)
export const getNavigationNodeSummariesSelector = createSelector([getNavigationNodeSummaries], (items) => items)
export const getNavigationNodeSummarySelector = createSelector([getNavigationNodeSummary], summary => summary)



export const getNavigationDescriptionFromSummarySelector = createSelector([getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes], (summary, descs, key, nodes) => {
  if(summary.description.indexOf('#') === 0) {
    //TODO: this is not right, we need a path to get this back.....
    return descs[noha(summary.description)]
  }
  else {
    const path = mergePath(key, summary.description)
    const {pathname, hash} = up(path)

    if(nodes[pathname]) {
      const node = nodes[pathname]
      const {itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result} = node
      return parseDescription(itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result, hash)
    } else {
      return pathname
    }
  }
})
export const getKeySelector = createSelector([getKey], key => key)

export const getChildData = createSelector(
  [getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes], (summary, descriptions, key, nodes) => {
    const path = mergePath(key, summary.description)
    const {pathname} = up(path)
    return {
      summary, descriptions, parentKey: key, node: nodes[pathname], pathname,
    }
  }
)

export const getCatalogData = createSelector(
  [getItemDescriptions, getNavigationNodeDescriptions, getNavigationNodeSummaries, getResult, getHash],
  (itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result, hash) => {
    return parseDescription(itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result, hash)
  }
)


export const getChildItemDescriptionsSelector = createSelector(
  [getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes], (summary, descs, key, nodes) => {
    const path = mergePath(key, summary.description)
    const {pathname} = up(path)
    if(nodes[pathname]) return nodes[pathname].itemDescriptions
    else return null
  }
)
export const getChildItemPathname = createSelector(
  [getNavigationNodeSummarySelector, getKey], (summary, key) => {
    const path = mergePath(key, summary.description)
    const {pathname} = up(path)
    return pathname
  }
)
export const getChildItemPlayablesSelector = createSelector(
  [getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes], (summary, descs, key, nodes) => {
    const path = mergePath(key, summary.description)
    const {pathname} = up(path)
    if(nodes[pathname]) return nodes[pathname].playables
    else return null
  }
)
export const getChildItemDescriptionSelector = createSelector(
  [getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes], (summary, descs, key, nodes) => {
    const path = mergePath(key, summary.description)
    const {pathname} = up(path)
    if(nodes[pathname]) return nodes[pathname].navigationNodeSummaries
    else return null
  }
)

const parseDescription = (itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result, hash) => {
  if (!result || !navigationNodeDescriptions) return
  const currentNavigationNode = hash || result
  let desc = Object.assign({}, navigationNodeDescriptions[noha(currentNavigationNode)]) // get a copy
  desc.summaryData = navigationNodeSummaries[noha(desc.summary)]
  desc.itemsData = desc.items.map(item => {
    let itemDesc = itemDescriptions[noha(item)]
    itemDesc.ref = item
    return itemDesc
  })
  return desc
}