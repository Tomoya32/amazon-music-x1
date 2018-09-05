import React, {Component} from 'react'
import {noha} from '../../lib/utils'
import HomeMenuHorizontalLoadingMenu from './HomeMenuHorizontalLoadingMenu'
import {connect} from 'react-redux'
import {replace} from '../../store/modules/nav'
import uj from 'url-join'

const mapStateToProps = (state, props) => ({
  path: state.music.pathLookup[props.result]
})
const mapDispatchToProps = {replace}

class HomeHorizontalMenuRendering extends Component {

  handleClick(item) {
    console.info(`Loading Item`, item)
    if(!item.playable) {
      const {navigationNodeSummaries, replace, itemDescriptions} = this.props
      const summary = navigationNodeSummaries[noha(item.navigationNodeSummary)]
      const path = this.props.path.replace(/#[^$]*/,'')
      if(summary) {
        const destination = uj('/list/', path, summary.description)
        return replace(destination)
      } else {
        const destination = uj('/list/', path, item.key)
        console.warn('got something strange here, may need to climb the ladder', destination)
        return replace(destination)

      }
    }

    // Do something with playables
    console.warn('handle playable')
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
      // desc.playable = playables ? playables[noha(desc.playable)] : null
      desc.playableItem = playables ? playables[noha(desc.playable)] : null
      return desc
    })
    const click = this.handleClick.bind(this)
    return (<HomeMenuHorizontalLoadingMenu items={items} name={result} focused={this.props.focused} onClick={click}/>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeHorizontalMenuRendering)