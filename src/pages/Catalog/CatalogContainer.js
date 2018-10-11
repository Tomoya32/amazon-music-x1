import React, { Component } from 'react'
import Catalog from './Catalog'
import { connect } from 'react-redux'
import { loadChildNode } from '../../store/modules/music'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import { replace, back } from '../../store/modules/nav'
import {  handleItemSelection } from '../../lib/utils'
import {
  getCatalogData,
  getPlayableSelector,
  getItemDescriptionsSelectors,
  getNavigationNodeSummariesSelector
} from '../../lib/selectors/node_selectors'
import PageLoading from '../../components/PageLoading'

const mapStateToProps = (state,ownProps) => ({
  highlightedTrack: state.menus[`catalogmenu:${ownProps.location.pathname}${ownProps.location.hash}`],
  catalog: getCatalogData(state),
  itemDescriptions: getItemDescriptionsSelectors(state),
  playables: getPlayableSelector(state),
  navigationNodeSummaries: getNavigationNodeSummariesSelector(state)
})

const mapDispatchToProps = {loadChildNode, replace, back}

const keys = new KeyEvents()

class CatalogContainer extends Component {
  constructor (p) {
    super(p)
    this.handleSelection = (dest) => {
      handleItemSelection.call(this, dest, this.props.location.pathname.replace(/^\/list\/?/,''))
    }
  }
  componentDidMount () {
    this._unsubBack = keys.subscribeTo('Back', () => this.handleBack())
  }

  componentWillUnmount () {
    if (this._unsubBack) this._unsubBack.unsubscribe()
    this._unsubBack = null
  }


  handleBack () {
    this.props.back()
  }

  render () {
    if (typeof(this.props.catalog) === 'object') {
      let thumbnail, currentIndex;
      if (this.props.highlightedTrack) {
        currentIndex = this.props.highlightedTrack.index;
        const { itemsData } = this.props.catalog;
        if (itemsData.length) thumbnail = itemsData[currentIndex].image
      }
      return <Catalog {...this.props.catalog}
        thumbnail={thumbnail}
        kid={this.props.location.pathname + this.props.location.hash}
        onSelect={this.handleSelection.bind(this)} />
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogContainer)
