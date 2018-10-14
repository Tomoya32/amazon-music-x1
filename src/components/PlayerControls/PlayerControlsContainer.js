import React, { Component } from 'react'
import PlayerControls from './PlayerControls'
import Space from '../../lib/reactv-redux/SpaceRedux'
import gt from 'lodash/get'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push, replace} from '../../store/modules/nav'
import { withRouter } from 'react-router'
import { setCurrentTime, setPlayerState, updateInitOnUpdate } from '../../store/modules/player'
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
  // infoShowing: state.amazon.showInfo,
  // skippable: gt(state, 'amazon.playable.attributes.skippable', false),
  // thumbedUp: state.amazon.thumbedUp,
})

const mapDispatchToProps = (dispatch) => {
  const creators = bindActionCreators({
    updateInitOnUpdate,
    setCurrentTime,
    setPlayerState,
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
    const {setCurrentTime} = this.props
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

  skip () {
    const {playerTime, handleTransition} = this.props
    $badger.userActionMetricsHandler(`PlayerControlsSkipCalled`, {playerTime})
  }

  render () {
    return (
      <PlayerControls
        restart={this.restart.bind(this)}
        pause={this.pause.bind(this)}
        play={this.play.bind(this)}
        togglePlayState={this.togglePlayState.bind(this)}
        skip={this.skip.bind(this)}
        {...this.props}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space(withRouter(PlayerControlsContainer)))
