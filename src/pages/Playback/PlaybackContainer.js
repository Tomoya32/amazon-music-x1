import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadTrack } from '../../store/modules/tracks'
import { replace } from 'connected-react-router'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import { back } from '../../store/modules/nav'
import Playback from './Playback'
import { playerCurrentSrc } from '../../store/modules/player'
import gt from 'lodash/get'
import {getPlayable, getTrackInstance, getPlayableNode, getTrackPointers} from './selectors'

const debug = console.info

const keys = new KeyEvents()

const mapStateToProps = (state) => ({
  playable: getPlayable(state),
  trackInstance: getTrackInstance(state),
  enclosing: getPlayableNode(state),
  trackPointers : getTrackPointers(state)
})

const mapDispatchToProps = {loadTrack, replace, back, playerCurrentSrc}

class PlaybackContainer extends Component {
  constructor(s) {
    super(s)
    this._mounted = false
    this.state = {
      focused: true
    }
  }

  componentDidMount () {
    this._unsubBack = keys.subscribeTo('Back', () => this.handleBack())
    debug('Mounted Playback Container')
    this.handleTrackPlayback()
    this._mounted = true
    this.setState({focused: true})
  }

  componentDidUpdate () {
    this.handleTrackPlayback()
  }

  componentWillUnmount () {
    debug('Unmounting Mounted Playback Container')
    if (this._unsubBack) this._unsubBack.unsubscribe()
    this._unsubBack = null
    this._mounted = false
  }

  handleBack () {
    console.info('handling back')
    this.props.back()
  }

  handleTrackPlayback () {
    const {trackInstance, playerCurrentSrc} = this.props
    if (trackInstance) {
      const src = gt(trackInstance, 'trackDefinitionData.audio.uri', null)
      if (src) playerCurrentSrc(src)
    }
  }

  handleTransition(transition) {
    if(!this.props.trackPointers[transition]) return null
    return () => {
      if(this._mounted) {
        this.setState({focused: false}) // Some wierdness on bindings if we don't do this.
        this.props.replace(this.props.trackPointers[transition])
      }
    }
  }


  render () {
    if (this.props.trackInstance && this.props.trackInstance.trackDefinitionData) {
      return (<Playback {...this.props.trackInstance.trackDefinitionData}
                focused={this.state.focused}
                menuid={'playback-containeer'}
                onFocusItem='trackInfo'
                onShuffleNext={this.handleTransition('shufffleTrackPointer')}
                onNext={this.handleTransition('nextTrackPointer')}/>)
    } else {
      return (<div>Loading</div>)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackContainer)
