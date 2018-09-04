import React from 'react'
import { loadChildNode } from '../../store/modules/music'
import { connect } from 'react-redux'
import Node from './Node'
import { noha } from '../../lib/utils'
import gt from 'lodash/get'

const getData = (state) => {
  const path = state.music.pathLookup[state.home.enclosing]
  const enclosing = state.music.nodes[path]
  const current = enclosing.itemDescriptions[noha(state.home.current)]
  const items = gt(current, 'summary.data.items', [])

  if (!items.length && current.summary.description.indexOf('#') !== 0) {
    current.renderingItems = null
    return current
  }
  current.renderingItems = items.map(item => {
    const key = noha(item)
    const desc = enclosing.itemDescriptions[key]
    desc.summary = enclosing.navigationNodeSummaries ? enclosing.navigationNodeSummaries[noha(desc.navigationNodeSummary)] : null
    if (desc.summary && desc.summary.description.indexOf('#') === 0) {
      desc.summary.data = enclosing.navigationNodeDescriptions[noha(desc.summary.description)]
    }
    desc.playable = enclosing.playables ? enclosing.playables[noha(desc.playable)] : null
    return desc
  })
  return current
}

const getDescription = (state) => {
  const path = state.music.pathLookup[state.home.enclosing]
  const enclosing = state.music.nodes[path]
  const current = enclosing.itemDescriptions[noha(state.home.current)]
  return current.summary.description
}

const mapStateToProps = (state) => ({
  data: getData(state),
  description: getDescription(state),
  enclosing: state.music.nodes[state.music.pathLookup[state.home.enclosing]],
  currentPath: state.home.currentPath,
  longPath: state.home.currentPath.replace(/#[^$]*$/, '') + getDescription(state)
})

const mapDispatchToProps = {
  loadChildNode
}

class NodeContainer extends React.Component {
  componentDidMount () {
    if (this.props.data.renderingItems === null) {
      this.props.loadChildNode(this.props.longPath)
    }
  }

  componentDidUpdate () {
    if (this.props.data.renderingItems === null) {
      this.props.loadChildNode(this.props.longPath)
    }
  }

  render () {
    if (this.props.data)
      return (<Node {...this.props.data} />)
    else return null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeContainer)