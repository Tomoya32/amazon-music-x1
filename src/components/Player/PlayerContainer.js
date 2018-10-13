import { connect } from 'react-redux'
import {
  setPlayerControlsState,
  updatePlayTime,
  playerError,
  onCanPlay,
  setCurrentTime,
  setPlayerState,
  playerGotDuration,
  onReadyStateChange,
  onEnded,
  setProperties,
  playerCurrentSrc,
  onLoadEnd,
  onLoadStart,
  setBadState
} from '../../store/modules/player'

import Player from './Player'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { displayError } from '../../store/modules/errormodal'
// import debugWrapper from 'debug'

// const debug = debugWrapper('app:player_container')
const debug = console.info

const mapDispatchToProps = {
  playerCurrentSrc,
  setPlayerControlsState,
  updatePlayTime,
  playerError,
  onCanPlay,
  setCurrentTime,
  setPlayerState,
  onReadyStateChange,
  onEnded,
  onLoadStart,
  onLoadEnd,
  setProperties,
  setBadState,
  gotDuration: playerGotDuration,
  displayError
}

const mapStateToProps = (state) => ({
  currentError: state.player.currentError,
  playerTime: state.player.currentTime,
  playerUrl: state.player.currentUrl,
  updateCurrentTime: state.player.updateCurrentTime,
  playerState: state.player.playerState,
  playerControlsState: state.player.playerControlsState,
  playerClearing: state.player.clearing,
  disablePlayer: state.player.disablePlayer
})

class PlayerWrapper extends Component {
  shouldComponentUpdate (nextProps) {
    return (nextProps.playerUrl !== this.props.playerUrl ||
      nextProps.playerState !== this.props.playerControlsState ||
      nextProps.updateCurrentTime === 0)
  }

  errorHandler (e) {
    const {displayError} = this.props
    if(!e.code) {
      displayError('Media Error', e.message && e.message.length ? e.message : 'No message')
    } else {
      const titles = ['none', 'Media Aborted', 'Media Network Error', 'Media Decode Error', 'Media Source Not Supported']
      const descriptions = ['', `The fetching of the associated resource was aborted by the user's request.`,
        `	Some kind of network error occurred which prevented the media from being successfully fetched, despite having previously been available.`,
        `Despite having previously been determined to be usable, an error occurred while trying to decode the media resource, resulting in an error.`,
        `The associated resource or media provider object (such as a MediaStream) has been found to be unsuitable.`]
      displayError(titles[e.code], descriptions[e.code])
    }

  }

  render () {
    if (!this.props.playerUrl) {
      return null
    } else {
      debug('playing rec....')
      return <Player {...this.props} disableTimeUpdates={false}
        errorHandler={this.errorHandler.bind(this)} />
    }
  }
}

PlayerWrapper.propTypes = {
  recommendation: PropTypes.object,
  playerControlsState: PropTypes.string,
  playerState: PropTypes.string,
  recommendationEnded: PropTypes.func,
  getNextRecommendation: PropTypes.func,
  recommendationError: PropTypes.func,
  playerTime: PropTypes.number,
  currentError: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerWrapper)
