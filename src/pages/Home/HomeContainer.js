import React  from 'react'
import Home from './Home'
import {connect} from 'react-redux'
import {
  getCatalogData,
  getPlayableSelector,
  getItemDescriptionsSelectors,
  getNavigationNodeSummariesSelector,
  getKeySelector
} from '../../lib/selectors/node_selectors'

const mapStateToProps = (state) => ({
  catalog: getCatalogData(state),
  itemDescriptions: getItemDescriptionsSelectors(state),
  playables: getPlayableSelector(state),
  pathname: state.router.location.pathname,
  navigationNodeSummaries: getNavigationNodeSummariesSelector(state),
  display: state.home.display,
  pathKey: getKeySelector(state)
})

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


class HomeContainer extends React.Component {
  render() {
    if(this.props.catalog) {
      return (<Home catalog={this.props.catalog} pathKey={this.props.pathKey} topNav={TOP_NAV} focused menuid={'homespace'} onFocusItem='topnav'/>)
    } else {
      return null
    }
  }
}
export default connect(mapStateToProps)(HomeContainer)