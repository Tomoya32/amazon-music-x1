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
import { openModal } from '../../store/modules/modal'

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
  loadChildNode, showNode, replace, openModal
}

class HomeMenuHorizontalLoadingMenuContainer extends Component {
  constructor (p) {
    super(p)
    this.handleSelection = dest => handleItemSelection.call(this, dest, this.props.pathname)
    this.handleOpenModal = this.handleOpenModal.bind(this);
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

  handleOpenModal () {
    this.props.openModal()
  }

  render () {
    if (this.props.itemDescription) {
      if (this.props.itemDescription.ref== "#_obj0") {
        // If the data is for 'Try Amazon Unlimited Music', manipulate API response to populate HomeMenuCard
        let summary = {
          image: ["#_obj0"],
          itemsData: [this.props.itemDescription],
          summary: "/upsell-banner/"
        }
        return (<HomeMenuHorizontalLoadingMenu {...summary} onClick={this.handleOpenModal} focused={this.props.focused} name={this.props.itemDescription.navigationNodeSummary} allMenuIDs={this.props.allMenuIDs}/>)
      }
    }
    if (typeof(this.props.summary) === 'object') {
      return (
        <HomeMenuHorizontalLoadingMenu {...this.props.summary} onClick={this.handleSelection} focused={this.props.focused} name={this.props.itemDescription.navigationNodeSummary} allMenuIDs={this.props.allMenuIDs}/>)
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeMenuHorizontalLoadingMenuContainer)
