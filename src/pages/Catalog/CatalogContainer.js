import React,{Component} from 'react'
import Catalog from './CatalogDataContainer'
import {connect} from 'react-redux'
import {loadChildNode} from '../../store/modules/music'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import {replace, back} from '../../store/modules/nav'
import uj from 'url-join'
import {noha} from '../../lib/utils'

const keys = new KeyEvents()

const getCachedData = (state, props) => {
  const key = props.match.params.node
  const cached = state.music.nodes[key]
  return cached ?  cached : key
}

const mapStateToProps = (state, props) => ({
  data: getCachedData(state, props),
  key: props.location.pathname + props.location.hash
})

const mapDispatchToProps = {loadChildNode, replace, back}

class CatalogContainer extends Component {
  componentDidMount() {
    if(typeof this.props.data === 'string') {
      this.props.loadChildNode(this.props.data)
    }
    this._unsubBack = keys.subscribeTo('Back', () => this.handleBack() )
  }
  componentDidUpdate() {
    if(typeof this.props.data === 'string') {
      this.props.loadChildNode(this.props.data)
    }
  }
  componentWillUnmount() {
    if(this._unsubBack) this._unsubBack.unsubscribe()
    this._unsubBack = null
  }
  handleSelection(selected) {
    if(selected.playable) {
      const {playables, itemDescriptions} = this.props.data
      const item = itemDescriptions[noha(selected.ref)]
      const playable = playables[noha(item.playable)]
      this.props.replace(uj('/playback', this.props.location.pathname,playable.self))
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
      return <Catalog {...this.props.data} location={this.props.location} kid={this.props.location.pathname + this.props.location.hash} onSelect={this.handleSelection.bind(this)} />
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogContainer)