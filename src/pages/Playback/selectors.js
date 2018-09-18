import { createSelector } from 'reselect'
import { noha } from '../../lib/utils'

export const getPlayableNode = state => {
  if (state.playable.node) {
    return state.music.nodes[state.playable.node]
  }
}
export const getPlayable = state => state.playable

const getDescriptionFromNode = (node, playable) => {
  if(!node || !playable) return null
  if(!node.trackContainerChunkDescriptions) {
    console.warn('node does not have node.trackContainerChunkDescriptions')
    return null
  }

  const trackContainerChunkDescription = node.trackContainerChunkDescriptions[noha(playable.chunk)]
  if(!trackContainerChunkDescription) {
    console.warn(' NO trackContainerChunkDescription')
    return null
  }
  return trackContainerChunkDescription
}

export const getTrackContainerChunkDescription = createSelector(getPlayableNode, getPlayable, getDescriptionFromNode )

export const getTrackInstance = createSelector( getPlayableNode, getPlayable, (node, playable) => {
  if(!node || !playable) return null
  const desc = getDescriptionFromNode(node, playable)
  if(!desc) return null
  const instance = desc.trackInstances[playable.indexWithinChunk]
  const data = node.trackInstances[noha(instance)]
  data.trackDefinitionData = node.trackDefinitions[noha(data.trackDefinition)]
  return data
})

