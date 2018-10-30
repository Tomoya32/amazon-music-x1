import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { loadChildNode } from '../../store/modules/music'
import { connect } from 'react-redux'
import './HomeMenuHorizontalLoadingMenu.css'
import PropTypes from 'prop-types'
import { showNode } from '../../store/modules/home'
import { handleItemSelection } from '../../lib/utils'
import HomeMenuHorizontalLoadingMenu from './HomeMenuHorizontalLoadingMenu'
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
  // summary: getNavigationDescriptionFromSummarySelector(state, props),
  // pathKey: getKeySelector(state),
  // itemDescriptions: getChildItemDescriptionsSelector(state, props),
  // playables: getChildItemPlayablesSelector(state, props),
  // navigationNodeSummaries: getChildItemDescriptionSelector(state, props),
  // pathname: getChildItemPathname(state, props)
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

  componentDidMount () {
    this.loadIfNeeded()
  }

  componentDidUpdate () {
    this.loadIfNeeded()
  }

  loadIfNeeded () {
    if (typeof(this.props.summary) === 'string') {
      console.info('loadChildNode: ', this.props.summary)
      debugger
      this.props.loadChildNode(this.props.summary)
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
