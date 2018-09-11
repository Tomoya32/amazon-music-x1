import React, { Component } from 'react'
import { loadChildNode } from '../../store/modules/music'
import { connect } from 'react-redux'
import './HomeMenuHorizontalLoadingMenu.css'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { showNode } from '../../store/modules/home'
import {
  getNavigationDescriptionFromSummarySelector,
  getKeySelector
} from '../../lib/selectors/node_selectors'
import { handleItemSelection } from '../../lib/utils'
import HomeMenuHorizontalLoadingMenu from './HomeMenuHorizontalLoadingMenu'

const mapStateToProps = (state, props) => ({
  summary: getNavigationDescriptionFromSummarySelector(state, props),
  pathKey: getKeySelector(state)

})

const mapDispatchToProps = {
  loadChildNode, showNode
}

class HomeMenuHorizontalLoadingMenuContainer extends Component {
  constructor (p) {
    super(p)
    this.handleSelection = handleItemSelection.bind(this)
  }

  static propTypes = {
    itemDescription: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.loadIfNeeded()
  }

  componentDidUpdate () {
    this.loadIfNeeded()
  }

  loadIfNeeded () {
    if (typeof(this.props.summary) === 'string') {
      this.props.loadChildNode(this.props.summary)
    }
  }

  render () {
    if (typeof(this.props.summary) === 'object') {
      return (
        <HomeMenuHorizontalLoadingMenu {...this.props.summary} onClick={this.handleSelection} />)
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeMenuHorizontalLoadingMenuContainer)