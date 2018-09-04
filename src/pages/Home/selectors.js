import { createSelector } from 'reselect'
import {noha} from '../../lib/utils'

const getNode = state => state.music.currentParent ? state.music.nodes[state.music.currentParent] : null


export const getNodeDescriptionSelector = createSelector(
  [getNode],
  (node) => {
  if(!node) return null
  const object =  node.navigationNodeDescriptions[noha(node.result)]
  if(!object) {
    console.warn(`no node for ${node.result} in `, node.navigationNodeDescriptions)
    return null
  }
  object.itemDescriptions = object.items.map(item => {
    const desc = node.itemDescriptions[noha(item)]
    desc.summary = node.navigationNodeSummaries[noha(desc.navigationNodeSummary)]
    return desc
  })
  object.node = node
  return object
})