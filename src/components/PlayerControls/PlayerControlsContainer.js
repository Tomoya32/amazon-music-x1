import React, { Component } from 'react'
import PlayerControls from './PlayerControls'
import NamedMenu from '../../lib/reactv-navigation/components/NamedMenu'
import gt from 'lodash/get'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push, replace} from '../../store/reducers/navigation'
import { withRouter } from 'react-router'
import { setCurrentTime, setPlayState } from '../../store/reducers/player'
import { getNextRecommendation, thumbsUp } from '../../store/reducers/nprone'
import $badger from '../../lib/badger'
import { setSingleFocus } from '../../store/reducers/menus'
import { toggleInfo } from '../../store/reducers/podcast'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import debugWrapper from 'debug'
import NPROneSDK from 'npr-one-sdk'

const Keys = new KeyEvents()

const debug = debugWrapper('app:player_controls_container')

const mapStateToProps = (state, ownProps) => ({
  playerState: state.player.state,
  currentTime: state.player.currentTime,
  currentPath: state.routing.locationBeforeTransitions ? state.routing.locationBeforeTransitions.pathname : '',
  currentSection: state.explore ? state.explore.currentSection : 'catch_up',
  infoShowing: state.podcast.showInfo,
  recommendation: state.npr.recommendation,
  skippable: gt(state, 'npr.recommendation.attributes.skippable', false),
  thumbedUp: state.npr.thumbedUp,
  fetchingRecommendation: state.npr.fetchingRecommendation
})

const mapDispatchToProps = (dispatch) => {
  const creators = bindActionCreators({
    setCurrentTime,
    setPlayState,
    getNextRecommendation,
    setSingleFocus,
    push, replace,
    toggleInfo,
    thumbsUp
  }, dispatch)
  creators.explore = () => dispatch(push('/explore'))
  return creators
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps, ...stateProps, ...dispatchProps,
  explore () { dispatchProps.push(`explore/${stateProps.currentSection}`) }
})

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

  pause () {
    $badger.userActionMetricsHandler('PlayerControlsPaused')
    this.props.setPlayState('paused')
  }

  play () {
    $badger.userActionMetricsHandler('PlayerControlsPlaying')
    this.props.setPlayState('playing')
  }

  togglePlayState () {
    const newState = this.props.playerState === 'playing' ? 'paused' : 'playing'
    $badger.userActionMetricsHandler(`PlayerControlsTogglePlayState`, {from: this.props.playerState, to: newState})
    this.props.setPlayState(newState)
  }

  skip () {
    const {skippable, recommendation, getNextRecommendation, currentTime, fetchingRecommendation} = this.props
    debug('attempting to skip ', skippable, fetchingRecommendation)
    $badger.userActionMetricsHandler(`PlayerControlsSkipCalled`, {skippable, currentTime})
    if (skippable && !fetchingRecommendation) {
      // if (this.props.currentPath.indexOf('recommendation') > -1) this.props.replace('/')
      recommendation.recordAction(NPROneSDK.Action.SKIP, currentTime || 1)
      debug('getting next recommendation')
      getNextRecommendation()
    }
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(NamedMenu(withRouter(PlayerControlsContainer)))
