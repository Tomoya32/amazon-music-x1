import React, { Component } from 'react'
import PlayerControls from './PlayerControls'
import Space from '../../lib/reactv-redux/SpaceRedux'
import gt from 'lodash/get'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push, replace} from '../../store/modules/nav'
import { withRouter } from 'react-router'
import { setCurrentTime, setPlayerState } from '../../store/modules/player'
// import { getNextRecommendation, thumbsUp } from '../../store/reducers/nprone'
import $badger from '../../lib/badger'
// import { toggleInfo } from '../../store/reducers/podcast'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import debugWrapper from 'debug'

const Keys = new KeyEvents()

// const debug = debugWrapper('app:player_controls_container')
const debug = console.info

const mapStateToProps = (state, ownProps) => ({
  playerControlsState: state.player.playerControlsState,
  currentTime: state.player.currentTime,
  currentPath: state.router.location ? state.router.location.pathname : '',
  // currentSection: state.explore ? state.explore.currentSection : 'catch_up',
  // infoShowing: state.podcast.showInfo,
  // recommendation: state.npr.recommendation,
  // skippable: gt(state, 'npr.recommendation.attributes.skippable', false),
  // thumbedUp: state.npr.thumbedUp,
  // fetchingRecommendation: state.npr.fetchingRecommendation
})

const mapDispatchToProps = (dispatch) => {
  const creators = bindActionCreators({
    setCurrentTime,
    setPlayerState,
    // getNextRecommendation,
    // setSingleFocus,
    push, replace,
    // toggleInfo,
    // thumbsUp
  }, dispatch)
  // creators.explore = () => dispatch(push('/explore'))
  return creators
}

// const mergeProps = (stateProps, dispatchProps, ownProps) => ({
//   ...ownProps, ...stateProps, ...dispatchProps,
//   explore () { dispatchProps.push(`explore/${stateProps.currentSection}`) }
// })

class PlayerControlsContainer extends Component {
  componentDidMount () {
    this.playevent = Keys.subscribeTo('Play', () => {
      this.togglePlayState()
    })
  }

  componentWillUnmount () {
    this.playevent.unsubscribe()
  }

  jumpBack () {
    if (this.props.fetchingRecommendation) {
      debug('not jumping during recommendation fetch....')
      return
    }
    const {currentTime, setCurrentTime} = this.props
    const jumpAmount = 15
    const jumpTime = (currentTime > jumpAmount) ? currentTime - jumpAmount : 0
    console.info('Jump Back ', currentTime, jumpAmount, jumpTime)
    $badger.userActionMetricsHandler(`PlayerJumpBack`, {currentTime, jumpAmount, jumpTime})
    setCurrentTime(jumpTime)
  }

  // TODO: add to my favorite function

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
    $badger.userActionMetricsHandler(`PlayerControlsTogglePlayState`, {from: this.props.playerControlsState, to: newState})
    console.log('STATE - setting playerState: ',newState)
    this.props.setPlayerState(newState)
  }

  skip () {
    const {currentTime, handleTransition} = this.props
    debug('attempting to skip ')
    $badger.userActionMetricsHandler(`PlayerControlsSkipCalled`, {currentTime})
  }

  render () {
    return (
      <PlayerControls
        pause={this.pause.bind(this)}
        play={this.play.bind(this)}
        togglePlayState={this.togglePlayState.bind(this)}
        skip={this.skip.bind(this)}
        jumpBack={this.jumpBack.bind(this)}
        {...this.props}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space(withRouter(PlayerControlsContainer)))
