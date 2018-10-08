import { connect } from 'react-redux'
import {
  updatePlayerState,
  updatePlayTime,
  playerError,
  onCanPlay,
  setCurrentTime,
  setPlayState,
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

const debug = console.info

const mapDispatchToProps = {
  playerCurrentSrc,
  updatePlayerState,
  updatePlayTime,
  playerError,
  onCanPlay,
  setCurrentTime,
  setPlayState,
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
  userPlayState: state.player.userPlayState,
  playerState: state.player.state,
  playerClearing: state.player.clearing,
  disablePlayer: state.player.disablePlayer
})

class PlayerWrapper extends Component {
  shouldComponentUpdate (nextProps) {
    return (nextProps.playerUrl !== this.props.playerUrl ||
      nextProps.userPlayState !== this.props.playerState ||
      nextProps.updateCurrentTime !== this.props.updateCurrentTime)
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
      return <Player {...this.props} disableTimeUpdates={false}
        errorHandler={this.errorHandler.bind(this)} />
    }
  }
}

PlayerWrapper.propTypes = {
  recommendation: PropTypes.object,
  playerState: PropTypes.string,
  userPlayState: PropTypes.string,
  recommendationEnded: PropTypes.func,
  getNextRecommendation: PropTypes.func,
  recommendationError: PropTypes.func,
  playerTime: PropTypes.number,
  currentError: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerWrapper)
