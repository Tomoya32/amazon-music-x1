import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { loadChildNode } from '../../store/modules/music'
import { connect } from 'react-redux'
import './HomeMenuHorizontalLoadingMenu.css'
import PropTypes from 'prop-types'
import { showNode } from '../../store/modules/home'
import {
  getMenuIDsSelector,
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
  allMenuIDs: getMenuIDsSelector(state),
  catalog: getCatalogData(state),
  location: state.router.location,
  summary: getNavigationDescriptionFromSummarySelector(state, props),
  pathKey: getKeySelector(state),
  itemDescriptions: getChildItemDescriptionsSelector(state, props),
  playables: getChildItemPlayablesSelector(state, props),
  navigationNodeSummaries: getChildItemDescriptionSelector(state, props),
  pathname: getChildItemPathname(state, props),
  nodes: state.music.nodes
})

const mapDispatchToProps = {
  loadChildNode, showNode, replace, openModal
}

class HomeMenuHorizontalLoadingMenuContainer extends Component {
  constructor (p) {
    super(p)
    this.handleSelection = dest => {
      const {pathname, replace} = this.props
      if(dest.type === 'SEE_MORE') replace(`/list/${pathname}`)
      else handleItemSelection.call(this, dest, this.props.pathname)
    }
    this.handleOpenModal = this.handleOpenModal.bind(this);
  }

  static propTypes = {
    itemDescription: PropTypes.object.isRequired
  }

  handleOpenModal () {
    this.props.openModal()
  }

  render () {
    if (this.props.itemDescription) {
      const { ref, itemLabel } = this.props.itemDescription;
      if (ref== "#_obj0" && itemLabel.startsWith('Try')) {
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
        <HomeMenuHorizontalLoadingMenu {...this.props.summary} onClick={this.handleSelection.bind(this)} focused={this.props.focused} name={this.props.itemDescription.navigationNodeSummary} allMenuIDs={this.props.allMenuIDs}/>)
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeMenuHorizontalLoadingMenuContainer)
