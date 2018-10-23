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
}

const getSearchNode = state => state.search.results.data
const getSearchterm = state => state.search.term

const getItemDescriptions = state => getNodeSegment(state, 'itemDescriptions')
const getNavigationNodeDescriptions = state => getNodeSegment(state, 'navigationNodeDescriptions')
const getNavigationNodeSummaries = state => getNodeSegment(state, 'navigationNodeSummaries')
const getPlayables = state => getNodeSegment(state, 'playables')
const getResult = state => getNodeSegment(state, 'result')
const getHash = state => state.router.location.hash
const getNavigationNodeDescription = (state, { navigationNode }) => {
  const node = getNavigationNodeDescriptions(state)
  return node[navigationNode]
}

export const getNavigationNodeSelector = createSelector([getNavigationNodeDescription], node => node)
export const getPlayableSelector = createSelector([getPlayables], (playables) => playables)
export const getItemDescriptionsSelectors = createSelector([getItemDescriptions], (items) => items)
export const getNavigationNodeSummariesSelector = createSelector([getNavigationNodeSummaries], (items) => items)

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

export const getKeySelector = createSelector([getKey], key => key)

export const getCatalogData = createSelector(
  [getItemDescriptions],
  (itemDescriptions) => {
    return parseDescription(itemDescriptions)
  }
)

const parseDescription = (itemDescriptions) => {
  if (!itemDescriptions) return console.log('itemDescriptions are empty!');
  
  let descObj = Object.assign({}, itemDescriptions)

  let desc = {
    artist: null,
    displayTag: null,
    firstPage: null,
    image: null,
    items: [],
    itemsData: [],
    lastPage: null,
    nextPage: null,
    parent: "#search_summary",
    prevPage: null,
    searchFeature: null,
    summary: "#search",
  }
  
  const descArray = Object.keys(descObj).map(i => {
    if (descObj[i].playable) {
      desc.items.push(i);
      descObj[i].ref = i;
      desc.itemsData.push(descObj[i]);
    }
  });


  return desc
}
