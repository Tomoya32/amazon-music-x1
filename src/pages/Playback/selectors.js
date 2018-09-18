import { createSelector } from 'reselect'
import { noha } from '../../lib/utils'

export const getPlayableNode = state => {
  if (state.playable.node) {
    return state.music.nodes[state.playable.node]
  }
}
export const getPlayableItem = state => state.playable.item

export const getPlayable = createSelector(getPlayableNode, getPlayableItem, (node, item) => {
  return node && item ? node.playables[noha(item)] : null
})

export const getTrackDefinition = createSelector(
  getPlayableNode, getPlayable,
  (node, playable) => {
    return node && playable ? node.trackDefinitions[noha(playable.trackDefinition)] : null
  }
)
