import React, { Component } from 'react'
import Catalog from './Catalog'
import { connect } from 'react-redux'
import { loadChildNode } from '../../store/modules/music'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import { replace, back } from '../../store/modules/nav'
import uj from 'url-join'
import { noha, handleItemSelection } from '../../lib/utils'
import ru from 'resolve-url'
import {
  getCatalogData,
  getPlayableSelector,
  getItemDescriptionsSelectors,
  getNavigationNodeSummariesSelector
} from '../../lib/selectors/node_selectors'

const mapStateToProps = (state) => ({
  catalog: getCatalogData(state),
  itemDescriptions: getItemDescriptionsSelectors(state),
  playables: getPlayableSelector(state),
  pathname: state.router.location.pathname,
  navigationNodeSummaries: getNavigationNodeSummariesSelector(state)
})

const mapDispatchToProps = {loadChildNode, replace, back}

const keys = new KeyEvents()

class CatalogContainer extends Component {
  constructor (p) {
    super(p)
    this.handleSelection = handleItemSelection.bind(this)
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
      return <Catalog {...this.props.catalog}
        kid={this.props.location.pathname + this.props.location.hash}
        onSelect={this.handleSelection.bind(this)} />
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogContainer)