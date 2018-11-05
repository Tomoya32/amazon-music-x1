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

import { setCurrentTime, setPlayerState, updateInitOnUpdate, onStarted, setPlayerControlsState } from '../../store/modules/player'
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
  currentTime: state.player.currentTime,
  playbackEnded: state.player.playbackEnded,
  playerControlsState: state.player.playerControlsState,
  shouldSkip: state.thumbs.shouldSkip,
  currentPath: state.router.location ? state.router.location.pathname : '',
  location: state.router.location,
  playable: state.playable,
  music: state.music,
  chunk: getTrackContainerChunkDescription(state)
})

const mapDispatchToProps = (dispatch) => {
  const creators = bindActionCreators({
    onStarted,
    updateInitOnUpdate,
    setCurrentTime,
    setPlayerState,
    setPlayerControlsState,
    setPlayable,
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
    const { shouldSkip, playbackEnded } = this.props;
    if (!prevProps.shouldSkip && shouldSkip || playbackEnded) this.forwardSkip()
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
    const { setCurrentTime, onStarted, playbackEnded } = this.props
    const restartFrom = 0
    $badger.userActionMetricsHandler(`PlayerControlsRestart`, {restartFrom})
    if (playbackEnded) onStarted()
    setCurrentTime(restartFrom)
  }

  togglePlayState () {
    const newState = this.props.playerControlsState === 'playing' ? 'paused' : 'playing'
    // this will update playerState based on state of playerControlsState
    $badger.userActionMetricsHandler(`PlayerControlsTogglePlayState`, {from: this.props.playerControlsState, to: newState})
    this.props.setPlayerControlsState(newState)
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
              const path = totalURL.protocol + '/' + totalURL.host + '/playback' + totalURL.pathname
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
    this.reset()
    const { currentTime, onStarted, playbackEnded } = this.props
    if (currentTime > 2) this.restart()
    else this.handleTrackPlayback(0)
    if (playbackEnded) onStarted()
  }

  forwardSkip () {
    this.reset()
    const { currentTime, onStarted, playbackEnded } = this.props
    this.handleTrackPlayback(1)
    $badger.userActionMetricsHandler(`PlayerControlsSkipCalled`, { currentTime })
    if (playbackEnded) onStarted()
  }

  render () {
    const { trackRating } = this.props;
    const showThumbs = ((typeof trackRating === 'object') && (trackRating !== null));
    return (
      <PlayerControls
        giveThumbs={this.giveThumbs.bind(this)}
        restart={this.restart.bind(this)}
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
