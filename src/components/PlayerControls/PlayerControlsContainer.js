import React, { Component } from 'react'
import PlayerControls from './PlayerControls'
import Space from '../../lib/reactv-redux/SpaceRedux'
import gt from 'lodash/get'
import { random } from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push, replace} from '../../store/modules/nav'
import { withRouter } from 'react-router'
import { mergeChunkWithPathAndQuery, getLocation } from '../../lib/utils'
import { loadChildNode } from '../../store/modules/music'

import { setCurrentTime, setPlayerState, updateInitOnUpdate } from '../../store/modules/player'
import { getTrackContainerChunkDescription } from '../../pages/Playback/selectors'
import { setPlayable } from '../../store/modules/playable'

// import { thumbsDown, thumbsUp } from '../../store/modules/amazon'
import $badger from '../../lib/badger'
// import { toggleInfo } from '../../store/modules/player'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import debugWrapper from 'debug'
import { getRatingURI } from '../../lib/utils'
import { sendThumbs } from '../../store/modules/thumbs'

const Keys = new KeyEvents()

// const debug = debugWrapper('app:player_controls_container')
const debug = console.info

const mapStateToProps = (state, ownProps) => ({
  shouldSkip: state.thumbs.shouldSkip,
  playerControlsState: state.player.playerControlsState,
  currentTime: state.player.currentTime,
  currentPath: state.router.location ? state.router.location.pathname : '',
  location: state.router.location,
  playable: state.playable,
  chunk: getTrackContainerChunkDescription(state),
  duration: state.player.duration,
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
    loadChildNode,
    push, replace,
    sendThumbs
  }, dispatch)
  return creators
}

class PlayerControlsContainer extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      thumbRating: 'neutral',
      deriveState: true,
    }
    this.state = this.initialState;
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (prevState.deriveState && nextProps.trackRating && prevState.thumbRating !== nextProps.trackRating.thumbRating) {
      return { thumbRating: nextProps.trackRating.thumbRating }
    }
    return null
  }

  reset() {
    this.setState(this.initialState);
  }

  componentDidMount () {
    this.playevent = Keys.subscribeTo('Play', () => {
      this.togglePlayState()
    })
  }

  componentWillUnmount () {
    this.playevent.unsubscribe()
  }

  componentDidUpdate (prevProps) {
    const { shouldSkip, duration, currentTime, playerControlsState, playable, chunk } = this.props;
    if (!prevProps.shouldSkip && shouldSkip) this.forwardSkip()

    const lastTrackChunk = (chunk) ? chunk['trackInstances'].length - 1 : null
    const indexTrackChunk = (playable) ? parseInt(playable.indexWithinChunk) : null
    if (duration > 0 && Math.floor(currentTime) > duration - 2 &&
    playerControlsState === 'playing' &&
    prevProps.playable.indexWithinChunk == playable.indexWithinChunk &&
    lastTrackChunk !== indexTrackChunk) {
      /* This is a hack to skip song forward onEnded, since <video onEnded does not work. */
      this.forwardSkip()
    }
  }

  giveThumbs = (feedback) => {
    if (this.props.currentTime > 0) {
      $badger.userActionMetricsHandler(`PlayerControlsThumbs`, {feedback})
      const { currentTime, trackRating: { ratingURI }, currentPath, sendThumbs } = this.props;
      const clockTime = new Date();
      const trackRatingRequest = {}
      const thumbRating = (this.state.thumbRating !== feedback) ? feedback : 'neutral';
      trackRatingRequest.URI = getRatingURI(ratingURI, currentPath);
      trackRatingRequest.body = {
        thumbRating: thumbRating,
        trackPosition: Math.floor(currentTime * 1000),
        wallClockTime: clockTime.toISOString()
      }
      sendThumbs(trackRatingRequest)
      this.setState({ thumbRating: thumbRating, deriveState: false })
    }
  }

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
    this.props.loadChildNode(node)
    const musicPlayable = location.hash
    const lastTrackChunk = chunk['trackInstances'].length - 1
    const indexTrackChunk = parseInt(playable.indexWithinChunk)
    if (shuffle){
      const maxTrackChunk = random(0, lastTrackChunk)
      setPlayable(node, musicPlayable, (maxTrackChunk).toString())
    } else {
      if (indexTrackChunk >= 0) {
        if (direction === 1) {
          if (lastTrackChunk >= (indexTrackChunk + 1)) {
            setPlayable(node, musicPlayable, (indexTrackChunk + 1).toString())
          }
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
    const { currentTime } = this.props
    if (currentTime > 2) this.restart()
    else {
      this.reset()
      this.handleTrackPlayback(0)
    }
  }

  forwardSkip () {
    this.reset()
    const { currentTime } = this.props
    this.handleTrackPlayback(1)
    $badger.userActionMetricsHandler(`PlayerControlsSkipCalled`, { currentTime })
  }

  render () {
    const { trackRating } = this.props;
    const showThumbs = ((typeof trackRating === 'object') && (trackRating !== null));
    return (
      <PlayerControls
        giveThumbs={this.giveThumbs.bind(this)}
        restart={this.restart.bind(this)}
        pause={this.pause.bind(this)}
        play={this.play.bind(this)}
        backwardSkip={this.backwardSkip.bind(this)}
        togglePlayState={this.togglePlayState.bind(this)}
        showThumbs={showThumbs}
        thumbRating={this.state.thumbRating}
        forwardSkip={this.forwardSkip.bind(this)}
        {...this.props}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space(withRouter(PlayerControlsContainer)))
