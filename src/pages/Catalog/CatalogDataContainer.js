import React, { Component } from 'react'
import Catalog from './Catalog'
import { noha } from '../../lib/utils'

export default class CatalogDataContainer extends Component {
  render () {
    const {itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result, onSelect, location: {hash}} = this.props
    const currentNavigationNode = hash || result
    let desc = Object.assign({}, navigationNodeDescriptions[noha(currentNavigationNode)]) // get a copy
    desc.summaryData = navigationNodeSummaries[noha(desc.summary)]
    desc.itemsData = desc.items.map(item => {
      let itemDesc = itemDescriptions[noha(item)]
      itemDesc.ref = item
      return itemDesc
    })
    return (<Catalog {...desc} kid={this.props.kid} onSelect={onSelect} />)
  }
}