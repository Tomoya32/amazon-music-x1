import { connect } from 'react-redux'
import React, { Component } from 'react'
import ProgressBar from './ProgressBar'
import gt from 'lodash/get'
import { createSelector } from 'reselect'

const mapStateToProps = (state, ownProps) => ({
  currentTime: state.player.currentTime,
  duration: gt(state, 'npr.recommendation.attributes.duration', state.player.duration || 0),
  currentUrl: state.player.currentUrl
})

const mapDispatchToProps = () => ({})

class ProgressBarContainer extends Component {
  render () {
    if (this.props.duration === 0 || this.props.currentTime === 0 || isNaN(this.props.duration) || isNaN(this.props.currentTime)) return null
    return <ProgressBar {...this.props} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBarContainer)