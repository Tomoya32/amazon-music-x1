import { createSelector } from 'reselect'
import { noha } from '../utils'
import config from '../../config/index'
import {mergePath} from '../utils'
import up from 'url-parse'

const getKey = state => {
  const {pathname, search} = state.router.location
  let key = pathname.replace(/^\/(list|music)\/*/, '/')
  if (key === '/search/widescreen_catalog/') {
    if ( getSearchterm(state) )
      key = '/search/?keywords=<' + getSearchterm(state) + '>'
    else
      key = pathname.replace(/^\/(list|search)\/*/, '/')
    }
  return ((key === '' || key === '/') && /^\/?music(\/|$)/.test(pathname))
    ? config.music.browse_node : key === '' ? '/' : key
}

const getNodeSegment = (state, item, path) => {
  let key;
  if (path) key = path
  else key = getKey(state) // based on location
  const node = state.music.nodes[key]
  if (!node) return node
  else return node[item]
}
const getNodes = state => state.music.nodes
const getSearchNode = state => state.music.searchNode
const getSearchterm = state => state.search.term

const getItemDescriptions = (state,path) => getNodeSegment(state, 'itemDescriptions', path)
const getNavigationNodeDescriptions = (state,path) => getNodeSegment(state, 'navigationNodeDescriptions', path)
const getNavigationNodeSummaries = (state,path) => getNodeSegment(state, 'navigationNodeSummaries', path)
const getPlayables = (state,path) => getNodeSegment(state, 'playables', path)
const getResult = (state,path) => getNodeSegment(state, 'result', path)
const getHash = state => state.router.location.hash
const getNavigationNodeDescription = (state, {navigationNode}) => {
  const node = getNavigationNodeDescriptions(state)
  return node[navigationNode]
}
const getNavigationNodeSummary= (state, props) => {
  if(!props) return null
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
export const getMenuIDsSelector = createSelector([getItemDescriptions], (items) => {
  if (items) {
    let menuIDs = [];
    for (let key in items) {
      menuIDs.push(`homemenu:${items[key].navigationNodeSummary}`)
    }
    return menuIDs
  }
  else return
})
export const getNavigationDescriptionFromSummarySelector = createSelector([getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes], (summary, descs, key, nodes) => {
  if (!summary) {
    return null
  }
  if (summary.description.indexOf('#') === 0) {
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
  let currentNavigationNode = hash || result
  if (!currentNavigationNode) return
  let desc = Object.assign({}, navigationNodeDescriptions[noha(currentNavigationNode)]) // get a copy
  if (!desc.items) return
  desc.summaryData = navigationNodeSummaries[noha(desc.summary)]
  let validItems = desc.items.filter(item => {
    const itemDescription = itemDescriptions[noha(item)];
    const { navigationNodeSummary, playable } = itemDescription;
    // it's a playable node
    if (playable && playable.length) return true
    // major differences with: if (!navigationNodeSummary && playable && playable.length) return true
    // it's a navigational node: check if node has any items in it
    const nodeSummary = navigationNodeSummaries[noha(navigationNodeSummary)];
    const navigational = (nodeSummary && nodeSummary.numItemsOfInterest > 0);
    const sandBoxItem = (!nodeSummary || !nodeSummary.playable && !nodeSummary.numItemsOfInterest)
    return (navigational || sandBoxItem)
  })
  // check desc.items because validItems returned an empty array.
  desc.itemsData = validItems.map(item => {
    let itemDesc = itemDescriptions[noha(item)]
    itemDesc.ref = item
    return itemDesc
  })
  return desc
}
