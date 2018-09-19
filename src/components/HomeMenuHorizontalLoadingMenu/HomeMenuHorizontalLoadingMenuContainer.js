import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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
  getChildPathSelector,
  getChildItemPlayablesSelector,
  getChildItemDescriptionSelector,
  getCatalogData,
  getChildItemDescriptionsSelector,
  getChildItemPathname
} from '../../lib/selectors/node_selectors'

const mapStateToProps = (state, props) => ({
  allMenuIDs: state.menus.allMenuIDs,
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
    this.handleSelection = dest => handleItemSelection.call(this, dest, this.props.pathname)
  }

  static propTypes = {
    itemDescription: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.loadIfNeeded()
  }

  componentDidUpdate () {
    this.loadIfNeeded()
    this.scrollElementIntoViewIfNeeded()
  }

  loadIfNeeded () {
    if (typeof(this.props.summary) === 'string') {
      this.props.loadChildNode(this.props.summary)
    }
  }

  scrollElementIntoViewIfNeeded () {
    if (this.props.focused) {
      // node is the element to make visible within container
      const node = ReactDOM.findDOMNode(this);
      if (node) {
        // scrollable container
        let container = node.parentElement.parentElement.parentElement;
        if (container) {
          // to control scroll position:
          let refTop = 252.5
          if ((node.offsetTop > refTop) || (container.scrollTop > node.offsetTop - refTop)) {
            // check if horizontal selection is within view
            container.scrollTop = node.offsetTop - refTop;
          }
        }
      }
    }
  }

  render () {
    if (typeof(this.props.summary) === 'object') {
      return (
        <HomeMenuHorizontalLoadingMenu {...this.props.summary} onClick={this.handleSelection} focused={this.props.focused} name={this.props.itemDescription.navigationNodeSummary} allMenuIDs={this.props.allMenuIDs}/>)
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeMenuHorizontalLoadingMenuContainer)
