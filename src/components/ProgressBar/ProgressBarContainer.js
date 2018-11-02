import { connect } from 'react-redux'
import React, { Component } from 'react'
import ProgressBar from './ProgressBar'

const mapStateToProps = (state, ownProps) => ({
  progressBarTime: state.player.progressBarTime,
  currentTime: state.player.currentTime,
  duration: state.player.duration,
  currentUrl: state.player.currentUrl
})

const mapDispatchToProps = () => ({})

class ProgressBarContainer extends Component {
  render () {
    return <ProgressBar {...this.props} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBarContainer)
