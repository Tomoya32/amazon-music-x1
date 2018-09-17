import React, { Component } from 'react'
import { loadChildNode } from '../../store/modules/music'
import { connect } from 'react-redux'
import './HomeMenuHorizontalLoadingMenu.css'
import PropTypes from 'prop-types'
import { showNode } from '../../store/modules/home'
import {
  getNavigationDescriptionFromSummarySelector,
  getKeySelector
} from '../../lib/selectors/node_selectors'
import { handleItemSelection } from '../../lib/utils'
import HomeMenuHorizontalLoadingMenu from './HomeMenuHorizontalLoadingMenu'
import {replace} from '../../store/modules/nav'
import {
  getPlayableSelector,
  getItemDescriptionsSelectors,
  getChildPathSelector,
  getChildItemPlayablesSelector,
  getChildItemDescriptionSelector,
  getCatalogData,
  getChildItemDescriptionsSelector,
  getChildItemPathname
} from '../../lib/selectors/node_selectors'

const mapStateToProps = (state, props) => ({
  catalog: getCatalogData(state),
  location: state.router.location,
  summary: getNavigationDescriptionFromSummarySelector(state, props),
  pathKey: getKeySelector(state),
  itemDescriptions: getChildItemDescriptionsSelector(state, props),
  playables: getChildItemPlayablesSelector(state, props),
  navigationNodeSummaries: getChildItemDescriptionSelector(state, props),
  pathname: getChildItemPathname(state, props)
})

const mapDispatchToProps = {
  loadChildNode, showNode, replace
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
        <HomeMenuHorizontalLoadingMenu {...this.props.summary} onClick={this.handleSelection} focused={this.props.focused} />)
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeMenuHorizontalLoadingMenuContainer)