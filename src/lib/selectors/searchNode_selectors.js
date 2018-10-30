import { createSelector } from 'reselect'
import { noha } from '../utils'
import config from '../../config/index'
import { mergePath } from '../utils'
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

const getNodeSegment = (state, item) => {
  const node = getSearchNode(state)
  if (!node) return console.log('There is empty!');
  else return node[item];
  // let key;
  // if (path) key = path
  // else key = getKey(state) // based on location
  // const node = state.music.nodes[key]
  // if (!node) return node
  // else return node[item]
}

const getSearchNode = state => state.search.results.data
const getNodes = state => state.music.nodes
const getSearchterm = state => state.search.term

const getItemDescriptions = (state) => getNodeSegment(state, 'itemDescriptions')
const getNavigationNodeDescriptions = (state) => getNodeSegment(state, 'navigationNodeDescriptions')
const getNavigationNodeSummaries = (state) => getNodeSegment(state, 'navigationNodeSummaries')
const getPlayables = (state) => getNodeSegment(state, 'playables')
const getResult = (state) => getNodeSegment(state, 'result')
const getHash = state => state.router.location.hash
const getNavigationNodeDescription = (state, { navigationNode }) => {
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
  // [getItemDescriptions],
  // (itemDescriptions) => {
  // return parseDescription(itemDescriptions)
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
  // const parseDescription = (itemDescriptions) => {
  //   if (!itemDescriptions) return console.log('itemDescriptions are empty!');
  //
  //   let descObj = Object.assign({}, itemDescriptions)
  //
  //   let desc = {
  //     artist: null,
  //     displayTag: null,
  //     firstPage: null,
  //     image: null,
  //     items: [],
  //     itemsData: [],
  //     lastPage: null,
  //     nextPage: null,
  //     parent: "#search_summary",
  //     prevPage: null,
  //     searchFeature: null,
  //     summary: "#search",
  //   }
  // const descArray = Object.keys(descObj).map(i => {
  //   if (descObj[i].playable) {
  //     desc.items.push(i);
  //     descObj[i].ref = i;
  //     desc.itemsData.push(descObj[i]);
  //   }
  // });
  if (!result || !navigationNodeDescriptions) return
  let currentNavigationNode = hash || result
  let desc = Object.assign({}, navigationNodeDescriptions[noha(currentNavigationNode)]) // get a copy
  // desc.summary = "#search_summary"
  // desc.summaryData = {
  //   description: "#search_desc"
  //   numItemsOfInterest: 2 <---- this should be 7
  //   playable: null
  //   title: "Search"
  // }
  desc.summaryData = navigationNodeSummaries[noha(desc.summary)]
  // desc.items = ["#catalog_search_item", "#library_search_item"]
  const summaries = desc.items.map(item => itemDescriptions[noha(item)].navigationNodeSummary)
  // summaries = ["#catalog_search_summary", "#library_search_summary"]
  const descriptions = summaries.map(summary => navigationNodeSummaries[noha(summary)].description);
  // descriptions = ["#catalog_search_desc", "#library_search_desc"]
  const items = descriptions.map(desc => navigationNodeDescriptions[noha(desc)].items);
  // items = [
  //   ["#catalog_artists_search_item",
  //   "#catalog_stations_search_item",
  //   "#catalog_albums_search_item",
  //   "#catalog_tracks_search_item",
  //   "#catalog_playlists_search_item"],
  //   ["#library_albums_search_item",
  //   "#library_tracks_search_item"]
  // ]
  let itemsParsed = [];
  // items.forEach(subItems => {
  //   itemsParsed.concat(subItems)
  // })
  for (let i=0; i < items.length; i++) {
    itemsParsed = itemsParsed.concat(items[i])
  }
  desc.itemsData = itemsParsed.map(item => {
    let itemDesc = itemDescriptions[noha(item)]
    itemDesc.ref = item
    return itemDesc
  })
  desc.items = itemsParsed;
  desc.summaryData.numItemsOfInterest = itemsParsed.length;
  // FAQ: what is desc.itemsData?
  // itemsData is same as catalog.itemsData in homescreen
  // debugger
  return desc
}
