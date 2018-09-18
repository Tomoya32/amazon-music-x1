import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadTrack } from '../../store/modules/tracks'
import { replace } from 'connected-react-router'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import { back } from '../../store/modules/nav'
import Playback from './Playback'
import { playerCurrentSrc } from '../../store/modules/player'
import gt from 'lodash/get'
import {getPlayable, getTrackInstance, getPlayableNode} from './selectors'

const keys = new KeyEvents()

const mapStateToProps = (state) => ({
  playable: getPlayable(state),
  trackInstance: getTrackInstance(state),
  enclosing: getPlayableNode(state)
})

const mapDispatchToProps = {loadTrack, replace, back, playerCurrentSrc}

class PlaybackContainer extends Component {
  componentDidMount () {
    this._unsubBack = keys.subscribeTo('Back', () => this.handleBack())
    this.handleTrackPlayback()
  }

  componentDidUpdate () {
    this.handleTrackPlayback()
  }

  componentWillUnmount () {
    if (this._unsubBack) this._unsubBack.unsubscribe()
    this._unsubBack = null
  }

  handleBack () {
    console.info('handling back')
    this.props.back()
  }

  handleTrackPlayback () {
    const {current, playerCurrentSrc} = this.props
    if (current) {
      const src = gt(current, 'audio.uri', null)
      if (src) playerCurrentSrc(src)
    }
  }

  render () {
    if (this.props.trackInstance && this.props.trackInstance.trackDefinitionData) {
      return (<Playback {...this.props.trackInstance.trackDefinitionData} focused={true} menuid={'playback-containeer'} onFocusItem='trackInfo' />)
    } else {
      return (<div>Loading</div>)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackContainer)