import React, { Component } from 'react'
import PlayerControls from './PlayerControls'
import Space from '../../lib/reactv-redux/SpaceRedux'
import gt from 'lodash/get'
import { random, indexOf } from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push, replace} from '../../store/modules/nav'
import { withRouter } from 'react-router'
import { mergeChunkWithPathAndQuery, getLocation } from '../../lib/utils'
import querystring from 'querystring'

import { setCurrentTime, setPlayerState, updateInitOnUpdate } from '../../store/modules/player'
import { getTrackContainerChunkDescription } from '../../pages/Playback/selectors'
import { setPlayable } from '../../store/modules/playable'

// import { thumbsDown, thumbsUp } from '../../store/modules/amazon'
import $badger from '../../lib/badger'
// import { toggleInfo } from '../../store/modules/player'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import debugWrapper from 'debug'

const Keys = new KeyEvents()

// const debug = debugWrapper('app:player_controls_container')
const debug = console.info

const mapStateToProps = (state, ownProps) => ({
  playerControlsState: state.player.playerControlsState,
  playerTime: state.player.currentTime,
  currentPath: state.router.location ? state.router.location.pathname : '',
  location: state.router.location,
  playable: state.playable,
  chunk: getTrackContainerChunkDescription(state),
  duration: gt(state, 'npr.recommendation.attributes.duration', state.player.duration || 0),
  music: state.music,
  // infoShowing: state.amazon.showInfo,
  // skippable: gt(state, 'amazon.playable.attributes.skippable', false),
  // thumbedUp: state.amazon.thumbedUp,
})

const mapDispatchToProps = (dispatch) => {
  const creators = bindActionCreators({
    updateInitOnUpdate,
    setCurrentTime,
    setPlayerState,
    setPlayable,
    push, replace,
    // toggleInfo,
    // thumbsDown, // stations only
    // thumbsUp // stations only
  }, dispatch)
  return creators
}

class PlayerControlsContainer extends Component {
  componentDidMount () {
    this.playevent = Keys.subscribeTo('Play', () => {
      this.togglePlayState()
    })
  }

  componentWillUnmount () {
    this.playevent.unsubscribe()
  }

  // TODO: buttons
  /*
      thumbsDown
      **restart**
      previous
      **play/pause**
      **skip**
      shuffle
      thumbsUp
  */

  restart () {
    const { setCurrentTime } = this.props
    const restartFrom = 0
    $badger.userActionMetricsHandler(`PlayerControlsRestart`, {restartFrom})
    setCurrentTime(restartFrom)
  }

  pause () {
    $badger.userActionMetricsHandler('PlayerControlsPaused')
    this.props.setPlayerState('paused')
  }

  play () {
    $badger.userActionMetricsHandler('PlayerControlsPlaying')
    this.props.setPlayerState('playing')
  }

  togglePlayState () {
    const newState = this.props.playerControlsState === 'playing' ? 'paused' : 'playing'
    // this will update playerState based on state of playerControlsState
    $badger.userActionMetricsHandler(`PlayerControlsTogglePlayState`, {from: this.props.playerControlsState, to: newState})
    this.props.setPlayerState(newState)
  }

  handleTrackPlayback(direction) {
    const { setPlayable, location, playable, chunk, shuffle, music } = this.props
    const node = location.pathname.replace(/^\/?playback\/*/, '/').replace(/\/$/, '')
    const musicPlayable = location.hash
    const lastTrackChunk = chunk['trackInstances'].length - 1
    const indexTrackChunk = parseInt(playable.indexWithinChunk)
    if (shuffle){
      const maxTrackChunk = random(0, lastTrackChunk)
      setPlayable(node, musicPlayable, (maxTrackChunk).toString())
    } else {
      if (indexTrackChunk >= 0) {
        if (direction === 1) {
          if (lastTrackChunk >= (indexTrackChunk + 1))
            setPlayable(node, musicPlayable, (indexTrackChunk + 1).toString())
          else {
            if(chunk['nextTrackPointer']) {
              const totalURL = getLocation(music.pathResolvers[playable.node])
              const path = totalURL.protocol + '//' + totalURL.host + '/playback' + totalURL.pathname
              const dest = mergeChunkWithPathAndQuery(path, chunk['nextTrackPointer'].chunk, { indexWithinChunk: chunk['nextTrackPointer'].indexWithinChunk })
              this.props.history.push(dest)
            }
          }
        }
        if (direction === 0) {
          if (indexTrackChunk >= 1)
            setPlayable(node, musicPlayable, (indexTrackChunk - 1).toString())
          else {
            if (chunk['prevTrackPointer']) {
              const totalURL = getLocation(music.pathResolvers[playable.node])
              const path = totalURL.protocol + '//' + totalURL.host + '/playback' + totalURL.pathname
              const dest = mergeChunkWithPathAndQuery(path, chunk['prevTrackPointer'].chunk, { indexWithinChunk: chunk['prevTrackPointer'].indexWithinChunk })
              this.props.history.push(dest)
            }
          }
        }
      }
    }
  }

  backwardSkip () {
    const { playerTime } = this.props
    if (playerTime > 2) this.restart()
    else this.handleTrackPlayback(0)
  }

  forwardSkip () {
    const { playerTime } = this.props
    this.handleTrackPlayback(1)
    $badger.userActionMetricsHandler(`PlayerControlsSkipCalled`, { playerTime })
  }

  render () {
    return (
      <PlayerControls
        restart={this.restart.bind(this)}
        pause={this.pause.bind(this)}
        play={this.play.bind(this)}
        backwardSkip={this.backwardSkip.bind(this)}
        togglePlayState={this.togglePlayState.bind(this)}
        forwardSkip={this.forwardSkip.bind(this)}
        {...this.props}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space(withRouter(PlayerControlsContainer)))
