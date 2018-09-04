import React  from 'react'
import { getNodeDescriptionSelector } from './selectors'
import Home from './Home'
import {connect} from 'react-redux'
import Node from '../Node'

const TOP_NAV = [
  {
    name: 'Browse',
    path: '/music',
  },
  {
    name: 'Recents',
    path: '/recents',
  },
  {
    name: 'My Music',
    path: '/mymusic',
  },
  {
    name: 'Search',
    path: '/search',
  },
  {
    name: 'Settings',
    path: '/settings',
  }
]

const mapStateToProps = state => ({
  display: state.home.display,
  ...getNodeDescriptionSelector(state)
})

class HomeContainer extends React.Component {
  render() {
    switch(this.props.display) {
      case 'node':
        return <Node {...this.props} />
      default:
        return (<Home itemDescriptions={this.props.itemDescriptions} topNav={TOP_NAV} />)
    }

  }
}
export default connect(mapStateToProps)(HomeContainer)