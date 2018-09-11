import React, { Component } from 'react'
import Catalog from './Catalog'
import { noha } from '../../lib/utils'

export default class CatalogDataContainer extends Component {
  render () {
    const {itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result, onSelect, location: {hash}} = this.props
    const filter = hash || result
    let desc = navigationNodeDescriptions[noha(filter)]
    if(!desc && filter === hash)  desc = navigationNodeDescriptions[noha(result)]
    desc.summary = navigationNodeSummaries[noha(desc.summary)]
    if(desc.summary && desc.summary.description.indexOf('#') === 0) desc.summary.descriptionData = navigationNodeDescriptions[noha[desc.summary.description]]
    desc.items = desc.items.map(item => {
      const itemDesc = itemDescriptions[noha(item)]
      itemDesc.ref = item
      const summary = navigationNodeSummaries[noha(itemDesc.navigationNodeSummary)]
      itemDesc.summary = summary
      if(summary && summary.description.indexOf('#') === 0)  itemDesc.summary.descriptionData = navigationNodeDescriptions[noha(summary.description)]
      return itemDesc
    })
    return (<Catalog {...desc} kid={this.props.kid} onSelect={onSelect} />)
  }
}