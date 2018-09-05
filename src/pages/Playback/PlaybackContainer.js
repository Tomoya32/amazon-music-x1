import React,{Component} from 'react'
import {connect} from 'react-redux'
import {loadTrack} from '../../store/modules/tracks'
import {replace} from 'connected-react-router'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'

const keys = new KeyEvents()

const getCachedData = (state, props) => {
  const key = props.match.params.track
  return state.tracks.tracks[key]
}

const mapStateToProps = (state, props) => ({
  track: getCachedData(state, props),
})

const mapDispatchToProps = {loadTrack, replace}

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
  }

  render () {
    return (<div>Playback</div>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackContainer)