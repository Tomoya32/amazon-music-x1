import React, { Component } from 'react'
import Catalog from './Catalog'
import { noha } from '../../lib/utils'

export default class CatalogDataContainer extends Component {
  render () {
    const {itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result, onSelect, location: {hash}} = this.props
    const filter = hash || result
    let desc = Object.assign({}, navigationNodeDescriptions[noha(filter)]) // get a copy
    if(!Object.keys(desc).length && filter === hash) {
      desc = Object.assign({}, navigationNodeDescriptions[noha(result)])
    }
    desc.summary = navigationNodeSummaries[noha(desc.summary)]
    if(desc.summary && desc.summary.description.indexOf('#') === 0) desc.summary.descriptionData = navigationNodeDescriptions[noha[desc.summary.description]]
    if(!desc.items) debugger
    desc.items = desc.items.map(item => {
      let itemDesc = itemDescriptions[noha(item)]
      // We've already parsed this guy
      if(!itemDesc) debugger
      itemDesc.ref = typeof(item) === 'string' ? item : item.ref
      const summary = navigationNodeSummaries[noha(itemDesc.navigationNodeSummary)]
      itemDesc.summary = summary
      if(summary && summary.description.indexOf('#') === 0)  itemDesc.summary.descriptionData = navigationNodeDescriptions[noha(summary.description)]
      return itemDesc
    })

    if(!desc.summary) debugger
    return (<Catalog {...desc} kid={this.props.kid} onSelect={onSelect} />)
  }
}