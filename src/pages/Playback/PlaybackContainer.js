import React,{Component} from 'react'
import {connect} from 'react-redux'
import {loadTrack} from '../../store/modules/tracks'
import {replace} from 'connected-react-router'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import {noha} from '../../lib/utils'
import {back} from '../../store/modules/nav'
import Playback from './Playback'
import {playerCurrentSrc} from '../../store/modules/player'
import {createSelector} from 'reselect'
import gt from 'lodash/get'

const keys = new KeyEvents()


const getTrackData = state => {
  const key = state.router.location.pathname.replace(/^\/?playback(\/|$)/, '')
  return state.tracks.tracks[key]
}
const getTrackIndex = state => {
  const key = state.router.location.pathname.replace(/^\/?playback(\/|$)/, '')
  return state.tracks.instanceIndex[key] || 0
}
const getRouterHash = state => state.router.location.hash
const getCurrentTrack = createSelector(
  [getTrackData, getTrackIndex, getRouterHash], (trackData, trackIndex, hash) => {
    if(!trackData) return null
    const {trackContainerChunkDescriptions, playables, trackInstances, trackDefinitions} = trackData
    let chunkPointer = trackData.result
    if(hash) {
      const playable = playables[noha(hash)]
      if (playable) chunkPointer = playable.naturalTrackPointer.chunk
    }
    const chunk = trackContainerChunkDescriptions[noha(chunkPointer)]
    const instances = chunk.trackInstances.map(i => trackInstances[noha(i)]).map(x => x.def = trackDefinitions[noha(x.trackDefinition)])
    const current = instances[trackIndex]
    return current
  }
)

const mapStateToProps = (state) => ({
  current: getCurrentTrack(state)
})

const mapDispatchToProps = {loadTrack, replace, back, playerCurrentSrc}

class PlaybackContainer extends Component {
  componentDidMount() {
    this._unsubBack = keys.subscribeTo('Back', () => this.handleBack() )
    this.handleTrackPlayback()
  }
  componentDidUpdate() {
    this.handleTrackPlayback()
  }
  componentWillUnmount() {
    if(this._unsubBack) this._unsubBack.unsubscribe()
    this._unsubBack = null
  }

  handleBack() {
    console.info('handling back')
    this.props.back()
  }
  handleTrackPlayback() {
    const {current, playerCurrentSrc} = this.props
    if(current ) {
      const src = gt(current, 'audio.uri', null)
      if(src) playerCurrentSrc(src)
    }
  }
  render () {
    if(this.props.current) {
      return (<Playback {...this.props.current} />)
    } else {
      return (<div>Loading</div>)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackContainer)