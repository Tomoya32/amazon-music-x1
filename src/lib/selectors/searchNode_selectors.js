import { createSelector } from 'reselect'
import { noha } from '../utils'
import config from '../../config/index'
import { mergePath } from '../utils'
import up from 'url-parse'

const getKey = state => {
  // will return '/search'
  const {pathname, search} = state.router.location
  let key = pathname.replace(/^\/(list|music)\/*/, '/')
  if (key === '/search/widescreen_catalog/') {
    if ( getSearchterm(state) )
      key = '/search/?keywords=<' + getSearchterm(state) + '>'
    else
      key = pathname.replace(/^\/(list|search)\/*/, '/')
    }
  const result = ((key === '' || key === '/') && /^\/?music(\/|$)/.test(pathname))
    ? config.music.browse_node : key === '' ? '/' : key
    return result
}

const getNodeSegment = (state, item) => {
  const node = getSearchNode(state)
  if (!node) return
  else return node[item];
}

const getSearchNode = state => state.search.results.data
const getNodes = state => state.music.nodes
const getSearchterm = state => state.search.term

// doc refers to the object returned in search results
// TODO: create selectors for:
  // document - nodes['/search']
const getDocument = state => getSearchNode(state)
  // document.result: '#search_desc'
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
const getState = (state) => state
const getProps = (state,props) => props
const getNavigationNodeSummary= (state, props) => {
  if(!props) return null
  // should have props.itemDescription.navigationNodeSummary
  const summary = props.navigationNodeSummary ||  props.itemDescription.navigationNodeSummary
  console.clear()
  console.log(props.itemDescription)
  if(!summary) return null
  const nodes = getNavigationNodeSummaries(state)
  const result = nodes[noha(summary)]
  return result
}

// navigationNodeDescription of document.result
const getDocNavigationNodeDescription = createSelector([getDocumentResult,getNavigationNodeDescriptions],
(result,descs) => descs[noha(result)] )

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

export const getNavigationNodeSelector = createSelector([getNavigationNodeDescription], node => node)
export const getItemDescriptionsSelectors = createSelector([getItemDescriptions], (items) => items)
export const getNavigationNodeSummariesSelector = createSelector([getNavigationNodeSummaries], (items) => items)
export const getNavigationNodeSummarySelector = createSelector([getNavigationNodeSummary], summary => summary)
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
export const getChildItemDescriptionSelector = createSelector(
  [getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes],
  (summary, descs, key, nodes) => {
    if (!summary) return null
    const path = mergePath(key, summary.description)
    const {pathname} = up(path)
    if(nodes[pathname]) return nodes[pathname].navigationNodeSummaries
    else return null
  }
)

export const getNavigationDescriptionFromSummarySelector = createSelector(
  [getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes],
  (summary, descs, key, nodes) => {
    // return navigationNodeDescription (to be used as props.summary by HomeMenuHorizontalLoadingMenuContainer)
  if (!summary) return null
  const parentNode = nodes[key];
  if (parentNode && summary.description.indexOf('#') === 0) {
    const currentNode_desc = noha(summary.description);
    const currentNode_summary = noha(descs[currentNode_desc].summary);
    const navigationNodeDescription = Object.assign({}, descs[currentNode_desc])
    const { items } = descs[currentNode_desc];
    navigationNodeDescription.itemsData = items.map(item => {
      let result = parentNode.itemDescriptions[noha(item)]
      if (!result) {
        console.error('Error because descs is not updating with every search. Need to fix getNavigationNodeDescriptions. \n descs: \n',descs,'\n parentNode: \n',parentNode)
        debugger
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
    // TODO: what do i do here?
    debugger
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
export const getChildItemPlayablesSelector = createSelector(
  [getProps,getNavigationNodeSummarySelector, getNavigationNodeDescriptions, getKey, getNodes], (props,summary, descs, key, nodes) => {
    // if (!summary || !props.summary) return null
    if (!summary) return null
    debugger
    const parentNode = nodes[key];
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
    // use getProps to load props.summary.itemsData then:
    // Can get each playable by looping through:
    const playablesList = itemsData.map(item => item.playable)

    // then get the playable object for each in playablesList:

    const playables = {}
    playablesList.forEach( playable => {
      const current = noha(playable);
      playables[current] = nodes['/search'].playables[current]
    })
    return playables
    // const tmp = up(summary.description);
    // if (tmp.pathname == '/') return summary.description
    // const path = mergePath(key, summary.description)
    // const {pathname} = up(path)
    // if(nodes[pathname]) return nodes[pathname].playables
    // else return null
  }
)

const parseChildren = (summary, descriptions, node) => {
  let desc = Object.assign({}, descriptions[noha(summary.description)]) // get a copy
  const { items } = desc;
  // TODO: need to generalize this
  desc.itemsData = items.map(item => {
    let itemDesc = node.itemDescriptions[noha(item)]
    if (itemDesc) return itemDesc.ref = item.replace(/_item$/,'_desc')
    return itemDesc
  })
  desc.summaryData = node.navigationNodeSummaries[summary]
  return desc
}


const parseDescription = (itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result, hash) => {
  if (!result || !navigationNodeDescriptions) return
  let currentNavigationNode = hash || result
  let desc = Object.assign({}, navigationNodeDescriptions[noha(currentNavigationNode)]) // get a copy
  desc.summaryData = navigationNodeSummaries[noha(desc.summary)]
  const summaries = desc.items.map(item => itemDescriptions[noha(item)].navigationNodeSummary)
  const descriptions = summaries.map(summary => navigationNodeSummaries[noha(summary)].description);
  const items = descriptions.map(desc => navigationNodeDescriptions[noha(desc)].items);
  let itemsParsed = [];
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
  return desc
}
