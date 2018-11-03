import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadTrack } from '../../store/modules/tracks'
import { replace } from 'connected-react-router'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import { back } from '../../store/modules/nav'
import Playback from './Playback'

import { playerCurrentSrc, setCurrentTime, setPlayerState, setProgressBarTime } from '../../store/modules/player'
import { setPlayable } from '../../store/modules/playable'

import gt from 'lodash/get'
import { getPlayable, getTrackInstance, getPlayableNode, getTrackPointers, getTrackContainerChunkDescription} from './selectors'
import PageLoading from '../../components/PageLoading'

const debug = console.info

const keys = new KeyEvents()

const mapStateToProps = (state) => ({
  progressBarTime: state.player.progressBarTime,
  modalMessage: state.thumbs.message,
  duration: state.player.duration,
  playerState: state.player.playerState,
  currentTime: state.player.currentTime,
  currentUrl: state.player.currentUrl,
  playable: getPlayable(state),
  trackInstance: getTrackInstance(state),
  enclosing: getPlayableNode(state),
  trackPointers : getTrackPointers(state),
  location: state.router.location,
  chunk: getTrackContainerChunkDescription(state),
})

const mapDispatchToProps = {
  setProgressBarTime,
  loadTrack,
  replace,
  back,
  playerCurrentSrc,
  setPlayable,
  setCurrentTime,
  setPlayerState
}

class PlaybackContainer extends Component {
  constructor(s) {
    super(s)
    this._mounted = false
    this.state = {
      focused: true,
      shuffle: false
    }
  }

  seek(direction) {
    const { currentTime, setCurrentTime, playerState, setPlayerState, duration, progressBarTime, setProgressBarTime } = this.props
    if (playerState === 'playing') setPlayerState('paused') // PAUSE SONG
    let _progressBarTime = progressBarTime;
    const seekBy = 15; // seconds
    const right = (direction > 0);
    if (_progressBarTime < currentTime && right || _progressBarTime > currentTime && !right) {
      _progressBarTime = currentTime
    }
    let newTime = _progressBarTime + seekBy*direction;
    newTime = (newTime > duration) ? duration : (newTime < 0 ? 0.001 : newTime)
    clearTimeout(this.resumeIn)
    // minimum delay = 500ms to avoid player.play() on first onLeft
    setProgressBarTime(newTime)
    this.resumeIn = setTimeout(() => {
      setCurrentTime(newTime)
      setPlayerState('playing') // PLAY SONG
    }, 500)
  }

  componentDidMount () {
    this._unsubBack = keys.subscribeTo('Back', () => this.handleBack())
    debug('Mounted Playback Container')
    this.handleTrackPlayback()
    this._mounted = true
    this.setState({focused: true})
  }

  componentDidUpdate (prevProps) {
    const src = gt(prevProps.trackInstance, 'trackDefinitionData.audio.uri', null)
    const newSrc = gt(this.props.trackInstance, 'trackDefinitionData.audio.uri', null)
    if (src !== newSrc) this.handleTrackPlayback()
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
    const {trackInstance, playerCurrentSrc, currentUrl} = this.props
    if (trackInstance) {
      const src = gt(trackInstance, 'trackDefinitionData.audio.uri', null)
      if (src && currentUrl !== src) playerCurrentSrc(src)
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

  shuffleTrackPlayback() {
    return this.setState({ shuffle: !this.state.shuffle })
  }

  render () {
    const { modalMessage } = this.props;
    if (this.props.trackInstance && this.props.trackInstance.trackDefinitionData) {
      return (<Playback {...this.props.trackInstance.trackDefinitionData}
        showModal={(modalMessage && modalMessage.length)}
        modalMessage={modalMessage}
        focused={this.state.focused}
        menuid={'playback-containeer'}
        onFocusItem='trackInfo'
        seek={this.seek.bind(this)}
        onShuffleNext={() => this.shuffleTrackPlayback()}
        shuffle = {this.state.shuffle}
        onNext={this.handleTransition('nextTrackPointer')}/>)
    } else {
      return (<PageLoading />)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackContainer)
