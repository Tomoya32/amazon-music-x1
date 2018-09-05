import React,{Component} from 'react'
import Catalog from './Catalog'
import {connect} from 'react-redux'
import {loadChildNode} from '../../store/modules/music'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import {replace, back} from '../../store/modules/nav'
import uj from 'url-join'
import {noha} from '../../lib/utils'
import ru from 'resolve-url'

const keys = new KeyEvents()

const getCachedData = (state) => {
  let key = state.router.location.pathname.replace(/^\/list/, '')
  key = key === '' ? '/' : key
  return state.music.nodes[key]
}

const mapStateToProps = (state) => ({
  data: getCachedData(state),
})


const mapDispatchToProps = {loadChildNode, replace, back}

class CatalogContainer extends Component {
  componentDidMount() {
    this._unsubBack = keys.subscribeTo('Back', () => this.handleBack() )
  }
  componentWillUnmount() {
    if(this._unsubBack) this._unsubBack.unsubscribe()
    this._unsubBack = null
  }
  handleSelection(selected) {
    if(selected.playable) {
      const {playables, itemDescriptions} = this.props.data
      const {pathname} = this.props.location
      const item = itemDescriptions[noha(selected.ref)]
      const playable = playables[noha(item.playable)]
      let dest = ru(uj(pathname, playable.self))
      dest = dest.replace(/.*\/\/[^/]*/, '')
          .replace(/^\/list\//,'/playback/')
      this.props.replace(dest)
    } else {
      const {navigationNodeSummaries} = this.props.data
      const navNode = navigationNodeSummaries[noha(selected.navigationNodeSummary)]
      const dest = uj(this.props.location.pathname, navNode.description)
      this.props.replace(dest)
    }
  }

  handleBack() {
    this.props.back()
  }

  render () {
    if(typeof(this.props.data) === 'object') {
      const {data:{itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, result}, location: {hash}} = this.props
      const currentNavigationNode = hash || result
      let desc = Object.assign({}, navigationNodeDescriptions[noha(currentNavigationNode)]) // get a copy
      desc.summaryData = navigationNodeSummaries[noha(desc.summary)]
      desc.itemsData = desc.items.map(item => {
        let itemDesc = itemDescriptions[noha(item)]
        itemDesc.ref = item
        return itemDesc
      })
      return <Catalog {...desc} kid={this.props.location.pathname + this.props.location.hash} onSelect={this.handleSelection.bind(this)} />
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogContainer)