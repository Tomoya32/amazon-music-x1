import React,{Component} from 'react'
import {connect} from 'react-redux'
import {loadTrack} from '../../store/modules/tracks'
import {replace} from 'connected-react-router'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import {noha} from '../../lib/utils'
import {back} from '../../store/modules/nav'
import Playback from './Playback'

const keys = new KeyEvents()

const getCachedData = (state) => {
  const key = state.router.location.pathname.replace(/^\/?playback(\/|$)/, '')
  return state.tracks.tracks[key]
}

const getCachedIndex = (state, props) => {
  const key = props.match.params.track
  return state.tracks.instanceIndex[key] || 0
}

const mapStateToProps = (state, props) => ({
  track: getCachedData(state, props),
  trackInstanceIndex: getCachedIndex(state, props)
})

const mapDispatchToProps = {loadTrack, replace, back}

class PlaybackContainer extends Component {
  componentDidMount() {
    this._unsubBack = keys.subscribeTo('Back', () => this.handleBack() )
  }
  componentWillUnmount() {
    if(this._unsubBack) this._unsubBack.unsubscribe()
    this._unsubBack = null
  }

  handleBack() {
    console.info('handling back')
    this.props.back()
  }

  render () {
    if(this.props.track) {
      const {trackContainerChunkDescriptions, playables, trackInstances, trackDefinitions} = this.props.track
      let chunkPointer = this.props.track.result
      if(this.props.location.hash) {
        const playable = playables[noha(this.props.location.hash)]
        if (playable) chunkPointer = playable.naturalTrackPointer.chunk
      }
      const chunk = trackContainerChunkDescriptions[noha(chunkPointer)]
      const instances = chunk.trackInstances.map(i => trackInstances[noha(i)]).map(x => x.def = trackDefinitions[noha(x.trackDefinition)])
      const current = instances[this.props.trackInstanceIndex]

      return (
        <Playback {...current} />
      )

    } else {
      return (<div>Loading</div>)
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackContainer)