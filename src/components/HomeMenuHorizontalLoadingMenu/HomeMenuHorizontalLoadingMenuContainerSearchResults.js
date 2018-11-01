import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { loadChildNode } from '../../store/modules/music'
import { connect } from 'react-redux'
import './HomeMenuHorizontalLoadingMenu.css'
import PropTypes from 'prop-types'
import { showNode } from '../../store/modules/home'
import { handleItemSelection, noha } from '../../lib/utils'
import HomeMenuHorizontalLoadingMenu from './HomeMenuHorizontalLoadingMenuSearchResults'
import {replace} from '../../store/modules/nav'
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
import { openModal } from '../../store/modules/modal'

const mapStateToProps = (state, props) => ({
  location: state.router.location,
  // allMenuIDs: getMenuIDsSelector(state),
  // catalog: getCatalogData(state),
  summary: getNavigationDescriptionFromSummarySelector(state, props), // line 117
  pathKey: getKeySelector(state),
  itemDescriptions: getChildItemDescriptionsSelector(state, props),
  playables: getChildItemPlayablesSelector(state, props), // line 215
  navigationNodeSummaries: getChildItemDescriptionSelector(state, props),
  pathname: getChildItemPathname(state, props) // /catalog/recs/albums
})

const mapDispatchToProps = {
  loadChildNode, showNode, replace, openModal
}

class HomeMenuHorizontalLoadingMenuContainer extends Component {
  constructor (p) {
    super(p)
    this.handleSelection = dest => {
      const { pathname } = this.props.location;
      // TODO: .ref is missing from itemDescription
      if (!dest.type && dest.itemLabel === 'See more') {
        const { description } = this.props.navigationNodeSummaries[noha(dest.navigationNodeSummary)]
        this.props.replace(`/search/${description}`)
      }
      handleItemSelection.call(this, dest, pathname)
    }
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
      console.info('loadChildNode: ', this.props.summary)
      // debugger
      // this.props.addChildNode(payload.data, action.path, responsePath)
    }
  }

  handleOpenModal () {
    this.props.openModal()
  }

  render () {
      if (this.props.summary && this.props.itemDescription) {
        const { ref, itemLabel }= this.props.itemDescription;
        if (ref== "#_obj0" && itemLabel.startsWith('Try')) {
          // If the data is for 'Try Amazon Unlimited Music', manipulate API response to populate HomeMenuCard
          let summary = {
            image: ["#_obj0"],
            itemsData: [this.props.itemDescription],
            summary: "/upsell-banner/"
          }
          return (<HomeMenuHorizontalLoadingMenu {...summary} onClick={this.handleOpenModal} focused={this.props.focused} name={this.props.itemDescription.navigationNodeSummary} allMenuIDs={this.props.allMenuIDs}/>)
        } else if (typeof(this.props.summary) === 'object') {
          return ( <HomeMenuHorizontalLoadingMenu {...this.props.summary} onClick={this.handleSelection.bind(this)} focused={this.props.focused} name={this.props.itemDescription.navigationNodeSummary} allMenuIDs={this.props.allMenuIDs}/>)
        }
      }
      return null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeMenuHorizontalLoadingMenuContainer)
