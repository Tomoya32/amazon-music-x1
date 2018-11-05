import { connect } from 'react-redux'
import {
  updateInitOnUpdate,
  setPlayerControlsState,
  playerError,
  onCanPlay,
  setCurrentTime,
  setPlayerState,
  playerGotDuration,
  onReadyStateChange,
  onEnded,
  setProperties,
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
  updateInitOnUpdate,
  setPlayerControlsState,
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
  currentTime: state.player.currentTime,
  playerUrl: state.player.currentUrl,
  playerState: state.player.playerState,
  playerControlsState: state.player.playerControlsState,
  playerClearing: state.player.clearing,
  disablePlayer: state.player.disablePlayer
})

class PlayerWrapper extends Component {
  constructor(p) {
    super(p);
    this.disableInitOnUpdate = true;
  }


  shouldComponentUpdate (nextProps) {
    const newUrl = (nextProps.playerUrl !== this.props.playerUrl);
    if (newUrl) this.disableInitOnUpdate = false;
    else this.disableInitOnUpdate = true;
    const playerMismatch = (nextProps.playerState !== this.props.playerState);
    const restart = (nextProps.currentTime === 0 || nextProps.currentTime !== this.props.currentTime);
    const shouldUpdate = (newUrl || playerMismatch || restart);
    return shouldUpdate
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
      return <Player {...this.props} disableTimeUpdates={false} disableInitOnUpdate={this.disableInitOnUpdate}
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
  currentTime: PropTypes.number,
  currentError: PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerWrapper)
