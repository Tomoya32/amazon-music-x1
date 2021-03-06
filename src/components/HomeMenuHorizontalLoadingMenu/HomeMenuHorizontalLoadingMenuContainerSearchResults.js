import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import './HomeMenuHorizontalLoadingMenu.css'
import PropTypes from 'prop-types'
import { showNode } from '../../store/modules/home'
import {
  getMenuIDsSelector,
  getNavigationDescriptionFromSummarySelector,
  getKeySelector,
  getChildPathSelector,
  getChildItemPlayablesSelector,
  getChildItemDescriptionSelector,
  getCatalogData,
  getChildItemDescriptionsSelector,
  getChildItemPathname
} from '../../lib/selectors/searchNode_selectors'
import { handleItemSelection, noha } from '../../lib/utils'
import HomeMenuHorizontalLoadingMenu from './HomeMenuHorizontalLoadingMenu'
import { replace } from '../../store/modules/nav'
import { openModal } from '../../store/modules/modal'
import { loadSearchList } from '../../store/modules/search'

const mapStateToProps = (state, props) => ({
  location: state.router.location,
  allMenuIDs: getMenuIDsSelector(state),
  catalog: getCatalogData(state),
  summary: getNavigationDescriptionFromSummarySelector(state, props), // line 117
  pathKey: getKeySelector(state),
  itemDescriptions: getChildItemDescriptionsSelector(state, props),
  playables: getChildItemPlayablesSelector(state, props),
  navigationNodeSummaries: getChildItemDescriptionSelector(state, props),
  pathname: getChildItemPathname(state, props)
})

const mapDispatchToProps = {
  showNode, replace, openModal, loadSearchList
}

class HomeMenuHorizontalLoadingMenuContainer extends Component {
  constructor(p) {
    super(p)
    this.handleSelection = dest => {
      const { pathname } = this.props.location;
      if (dest.itemLabel === 'See more') {
        const { description } = this.props.navigationNodeSummaries[noha(dest.navigationNodeSummary)]
        const endpoint = (description) ? `/${description}` : ''
        this.props.loadSearchList(pathname + endpoint, this, dest, pathname)
      } else {
        handleItemSelection.call(this, dest, pathname)
      }
    }
    this.handleOpenModal = this.handleOpenModal.bind(this);
  }

  static propTypes = {
    itemDescription: PropTypes.object.isRequired
  }

  handleOpenModal() {
    this.props.openModal()
  }

  render() {
    if (this.props.summary && this.props.itemDescription) {
      const { ref, itemLabel } = this.props.itemDescription;
      if (ref == "#_obj0" && itemLabel.startsWith('Try')) {
        // If the data is for 'Try Amazon Unlimited Music', manipulate API response to populate HomeMenuCard
        let summary = {
          image: ["#_obj0"],
          itemsData: [this.props.itemDescription],
          summary: "/upsell-banner/"
        }
        return (
          <HomeMenuHorizontalLoadingMenu
            {...summary}
            onClick={this.handleOpenModal}
            focused={this.props.focused}
            name={this.props.itemDescription.navigationNodeSummary}
            allMenuIDs={this.props.allMenuIDs}
            slots={2}
            onFarLeft={this.props.onFarLeft}
          />
        )
      } else if (typeof (this.props.summary) === 'object') {
        return (
          <HomeMenuHorizontalLoadingMenu
            {...this.props.summary}
            onClick={this.handleSelection.bind(this)}
            focused={this.props.focused}
            name={this.props.itemDescription.navigationNodeSummary}
            allMenuIDs={this.props.allMenuIDs}
            slots={2}
            onFarLeft={this.props.onFarLeft}
          />
        )
      }
    }
    return null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeMenuHorizontalLoadingMenuContainer)