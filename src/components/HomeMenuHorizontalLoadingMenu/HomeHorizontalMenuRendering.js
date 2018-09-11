import React, { Component } from 'react'
import { noha } from '../../lib/utils'
import HomeMenuHorizontalLoadingMenu from './HomeMenuHorizontalLoadingMenu'
import { connect } from 'react-redux'
import { replace } from '../../store/modules/nav'
import { handleItemSelection } from '../../lib/utils'

const mapStateToProps = (state, props) => ({
  path: state.music.pathLookup[props.result]
})
const mapDispatchToProps = {replace}

class HomeHorizontalMenuRendering extends Component {
  constructor (p) {
    super(p)
    this.handleSelection = handleItemSelection.bind(this)
  }



  render () {
    const {itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, playables, result} = this.props
    const items = navigationNodeDescriptions[noha(result)].items.slice(0, 5).map(item => {
      const key = noha(item)
      const desc = itemDescriptions[key]
      desc.key = item
      desc.summary = navigationNodeSummaries ? navigationNodeSummaries[noha(desc.navigationNodeSummary)] : null
      if (desc.summary && desc.summary.description.indexOf('#') === 0) {
        desc.summary.data = navigationNodeDescriptions[noha(desc.summary.description)]
      }
      // desc.playable = playables ? playables[noha(desc.playable)] : null
      desc.playableItem = playables ? playables[noha(desc.playable)] : null
      return desc
    })
    const click = this.handleClick.bind(this)
    return (<HomeMenuHorizontalLoadingMenu items={items} name={result} focused={this.props.focused}
      onClick={click} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeHorizontalMenuRendering)