import React, { Component } from 'react'
import HomeHorizontalMenuRendering from './HomeHorizontalMenuRendering'
import { loadChildNode } from '../../store/modules/music'
import { connect } from 'react-redux'
import './HomeMenuHorizontalLoadingMenu.css'
import cx from 'classnames'
import PropTypes from 'prop-types'
import {showNode} from '../../store/modules/home'

const mapStateToProps = (state, props) => ({
  data: props.data ? props.data : state.music.nodes[props.description],
})

const mapDispatchToProps = {
  loadChildNode, showNode
}

class HomeMenuHorizontalLoadingMenuContainer extends Component {
  static propTypes = {
    data: PropTypes.object,
    description: PropTypes.string.isRequired
  }

  componentDidMount () {
    if (!this.props.data) this.loadRemote()
  }

  componentDidUpdate () {
    if (!this.props.data) this.loadRemote()
  }

  loadRemote () {
    this.props.loadChildNode(this.props.description)
  }

  render () {
    if (this.props.data) {
      return (
        <div className={cx('HorizontalLoadingMenuWrapper', {focused: this.props.focused})}>
          <HomeHorizontalMenuRendering {...this.props.data} focused={this.props.focused} enclosing={this.props.data.result} showNode={this.props.showNode}  />
        </div>
      )
    } else {
      return (
        <div className='HorizontalLoadingMenuWrapper'>
          <h2>Loading</h2>
        </div>
      )
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeMenuHorizontalLoadingMenuContainer)
