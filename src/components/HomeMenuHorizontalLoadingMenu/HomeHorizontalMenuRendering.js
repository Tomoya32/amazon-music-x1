import React, {Component} from 'react'
import {noha} from '../../lib/utils'
import HomeMenuHorizontalLoadingMenu from './HomeMenuHorizontalLoadingMenu'
import {connect} from 'react-redux'

const mapStateToProps = (state, props) => ({
  path: state.music.pathLookup[props.result]
})

class HomeHorizontalMenuRendering extends Component {

  handleClick(item) {
    console.info(`Loading Item`, item)
    if(!item.playable) {
      this.props.showNode({enclosing: this.props.enclosing, current: item.key, currentPath: this.props.path})
    } else {
      console.warn('dont know how to treat playables yet....')
    }
  }

  render() {
    const {itemDescriptions, navigationNodeDescriptions, navigationNodeSummaries, playables, result} = this.props
    const items = navigationNodeDescriptions[noha(result)].items.slice(0, 5).map(item => {
      const key = noha(item)
      const desc = itemDescriptions[key]
      desc.key = item
      desc.summary = navigationNodeSummaries ? navigationNodeSummaries[noha(desc.navigationNodeSummary)] : null
      if(desc.summary && desc.summary.description.indexOf('#') === 0) {
        desc.summary.data = navigationNodeDescriptions[noha(desc.summary.description)]
      }
      desc.playable = playables ? playables[noha(desc.playable)] : null
      return desc
    })
    const click = this.handleClick.bind(this)
    return (<HomeMenuHorizontalLoadingMenu items={items} name={result} focused={this.props.focused} onClick={click}/>)
  }
}

export default connect(mapStateToProps)(HomeHorizontalMenuRendering)