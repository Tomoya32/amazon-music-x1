import { createSelector } from 'reselect'
import { noha } from '../../lib/utils'
import {mergePath, mergeChunkWithPathAndQuery} from '../../lib/utils'

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

const getResolvedPath = state => {
  if (state.playable.node) {
    return state.music.pathResolvers[state.playable.node]
  }
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


export const getTrackPointers = createSelector(getPlayable, getTrackContainerChunkDescription, getResolvedPath, (node, chunk, resolved) => {
  if(!node || !chunk) return {}
  const out = ['first','next','last','prev','shuffle'].reduce((mem, k) => {
    const key = `${k}TrackPointer`
    const pointer = chunk[key]
    if(!pointer) return mem
    mem[key] = mergeChunkWithPathAndQuery(['/playback', resolved], pointer.chunk, {indexWithinChunk: pointer.indexWithinChunk})
    return mem
  }, {})
  return out
})
