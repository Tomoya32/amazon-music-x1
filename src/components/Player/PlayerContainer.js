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
  gotDuration: playerGotDuration
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

  render () {
    if (!this.props.playerUrl) {
      return null
    } else {
      return <Player {...this.props} disableTimeUpdates={false} />
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
