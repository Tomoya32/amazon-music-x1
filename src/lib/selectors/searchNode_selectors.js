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
  if (!node) return
  else return node[item];
}



const getNodes = state => state.music.nodes
const getSearchNode = state => state.search.results.data
const getSearchterm = state => state.search.term
const getDocumentResult = (state) => getNodeSegment(state, 'result')
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
export const getPlayableSelector = createSelector(
  [getDocumentResult,getItemDescriptions,getNavigationNodeSummaries,getNavigationNodeDescriptions,getPlayables],
  (result,itemDescriptions,summaries,descriptions,playables) => {
    if (!playables) return
  const currentNode = noha(result)
  const description = descriptions[currentNode]
  // get listOfPlayablesForNode

//   select from playables
  const realPlayables = {};
  // listOfPlayablesForNode.forEach( item => {
  //   realPlayables[item] = playables[noha(item)]
  // })
  return playables
})
export const getItemDescriptionsSelectors = createSelector([getItemDescriptions], (items) => items)
export const getNavigationNodeSummariesSelector = createSelector([getNavigationNodeSummaries], (items) => items)
export const getNavigationNodeSummarySelector = createSelector([getNavigationNodeSummary], summary => summary)
// navigationNodeDescription of document.result
const getDocNavigationNodeDescription = createSelector([getDocumentResult,getNavigationNodeDescriptions],
(result,descs) => descs[noha(result)] )
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
export const getNavigationDescriptionFromSummarySelector = createSelector(
  [getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes,getSearchNode],
  (summary, descs, key, nodes, searchNode) => {
    // return navigationNodeDescription (to be used as props.summary by HomeMenuHorizontalLoadingMenuContainer)
  if (!summary) return null
  const parentNode = searchNode;
  if (parentNode && summary.description.indexOf('#') === 0) {
    const currentNode_desc = noha(summary.description);
    const currentNode_summary = noha(descs[currentNode_desc].summary);
    const navigationNodeDescription = Object.assign({}, descs[currentNode_desc])
    const { items } = descs[currentNode_desc];
    navigationNodeDescription.itemsData = items.map(item => {
      let result = parentNode.itemDescriptions[noha(item)]
      if (!result) {
        console.error('Error because descs is not updating with every search. Need to fix getNavigationNodeDescriptions. \n descs: \n',descs,'\n parentNode: \n',parentNode)
        return
      }
      // console.clear()
      // console.assert(item.match(/^_desc/),{ref: item, errorMsg: 'ref does not end in _desc'})
      // result.ref = item.replace(/_item$/,'_desc');
      result.ref = item.replace(/_item/,'_desc');
      return result
    })
    navigationNodeDescription.summaryData = parentNode.navigationNodeSummaries[currentNode_summary];
    // TODO: check if navigationNodeDescription.items[any key] can end with '_item' or needs '_desc'
    // compare navigationNodeDescription to this.props.summary of HomeMenuHorizontalLoadingMenuContainer
    return navigationNodeDescription
  } else {
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
  [getNavigationNodeSummarySelector, getItemDescriptionsSelectors, getNavigationNodeDescriptions, getKey, getNodes],
  (summary, itemDesc, descs, key, nodes) => {
    // TODO: Return the itemDescriptions for the items of this node
    // summary.description = "#catalog_stations_search_desc"
    // TODO: consider when summary.description is a URL
    if (!summary) return null
    const currentNode = summary.description;
    const { items } = descs[noha(currentNode)];
    const itemDescriptions = {};
    items.forEach(item => {
      const item_desc = item.replace(/_item$/,'_desc');
      itemDescriptions[noha(item_desc)] = itemDesc[noha(item)]
    })
    return itemDescriptions
  }
)
export const getChildItemPathname = createSelector(
  [getNavigationNodeSummarySelector, getKey], (summary, key) => {
    if (!summary) return null
    const tmp = up(summary.description);
    if (tmp.pathname == '/') return summary.description
    const path = mergePath(key, summary.description)
    const {pathname} = up(path)
    // pathname = '/catalog/recs/albums' || '#catalog_search_desc'
    return pathname
  }
)
export const getChildItemPlayablesSelector = createSelector(
  [getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes,getSearchNode], (summary, descs, key, nodes, searchNode) => {
    // if (!summary || !props.summary) return null
    if (!summary) return null
    const parentNode = searchNode
    const currentNode_desc = noha(summary.description);
    const { items } = descs[currentNode_desc];
    const itemsData = items.map(item => {
      let result = parentNode.itemDescriptions[noha(item)]
      if (!result) {
        console.error('Error because descs is not updating with every search. Need to fix getNavigationNodeDescriptions. \n descs: \n',descs,'\n parentNode: \n',parentNode)
        return
      }
      // console.clear()
      // console.assert(item.match(/^_desc/),{ref: item, errorMsg: 'ref does not end in _desc'})
      result.ref = item.replace(/_item$/,'_desc');
      // result.ref = item.replace(/_item/,'_desc');
      // result.ref = item
      return result
    })
    // Can get each playable by looping through:
    const playablesList = itemsData.filter(item => (item.playable)).map(item => item.playable)
    // then get the playable object for each in playablesList:
    const playables = {}
    playablesList.map( playable => {
      const current = noha(playable);
      playables[current] = searchNode.playables[current]
    })
    return playables
  }
)
export const getChildItemDescriptionSelector = createSelector(
  [getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes, getSearchNode],
  (summary, descs, key, nodes, searchNode) => {
    if (!summary) return null
    const path = mergePath(key, summary.description)
    const {pathname} = up(path)
    if(searchNode) return searchNode.navigationNodeSummaries
    else return null
  }
)
const parseDescription = (itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result, hash) => {
  if (!result || !navigationNodeDescriptions) return
  let currentNavigationNode = result
  // assigns navigationNodeDescription of currentNavigationNode to desc
  let desc = Object.assign({}, navigationNodeDescriptions[noha(currentNavigationNode)]) // get a copy
  // adds navigationNodeSummary of currentNavigationNode to .summaryData
  desc.summaryData = navigationNodeSummaries[noha(desc.summary)]
  // makes list of summaries from items (_items -> _summary) for items of currentNavigationNode (search results)
  const summaries = desc.items.map(item => itemDescriptions[noha(item)].navigationNodeSummary)
  // makes list of descriptions from items (_summary -> _desc) for items of currentNavigationNode
  const descriptions = summaries.map(summary => navigationNodeSummaries[noha(summary)].description);
  // takes items (catalog_search & library_search, catagories) and grabs their items (e.g. catalog_artists_search_item, row)
  const items = descriptions.map(_desc => navigationNodeDescriptions[noha(_desc)].items);
  let itemsParsed = [];
  // flatten items array into itemsParsed (all rows are here)
  for (let i=0; i < items.length; i++) {
    itemsParsed = itemsParsed.concat(items[i])
  }
  // adds itemDescriptions of grandchildren (e.g. catalog_artists_search_item) to itemsData
  desc.itemsData = itemsParsed.map(item => {
    let itemDesc = itemDescriptions[noha(item)]
    itemDesc.ref = item
    return itemDesc
  })
  desc.items = itemsParsed; // all rows
  desc.summaryData.numItemsOfInterest = itemsParsed.length;
  return desc
}

const parseChildren = (summary, descriptions, node) => {
  let desc = Object.assign({}, descriptions[noha(summary.description)]) // get a copy
  const { items } = desc;
  desc.itemsData = items.map(item => {
    let itemDesc = node.itemDescriptions[noha(item)]
    if (itemDesc) return itemDesc.ref = item.replace(/_item$/,'_desc')
    return itemDesc
  })
  desc.summaryData = node.navigationNodeSummaries[summary]
  return desc
}
// list of summaries of children: [_summary,...,_summary]
const getChildListOfSummaries = createSelector(
[getDocNavigationNodeDescription,getItemDescriptions],
(descs,itemDescriptions) => descs.items.map(item => itemDescriptions[noha(item)].navigationNodeSummary))
// list of descriptions of children [_desc,...,_desc]
const getChildListOfDescriptions = createSelector([getChildListOfSummaries,getNavigationNodeSummaries], (summariesList,navigationNodeSummaries) =>
summariesList.map(_summary => navigationNodeSummaries[noha(_summary)].descriptions))
// items of children
const getChildrenOfChildren = createSelector([getChildListOfDescriptions,getNavigationNodeDescriptions], (descsList,navigationNodeDescriptions) =>
descsList.map(_desc => navigationNodeDescriptions[noha(_desc)].items))
// navigationNodeSummaries of document.result
const getDocNavigationNodeSummarySelector = createSelector([getDocNavigationNodeDescription,getNavigationNodeSummaries],
(desc,summaries) => summaries[noha(desc.summary)])
