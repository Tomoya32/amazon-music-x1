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
import { updateMenuState } from '../../lib/reactv-redux/ReacTVReduxReducer'

const mapStateToProps = (state) => ({
  allMenuIDs: state.menus.allMenuIDs,
  catalog: getCatalogData(state),
  itemDescriptions: getItemDescriptionsSelectors(state),
  playables: getPlayableSelector(state),
  pathname: state.router.location.pathname,
  navigationNodeSummaries: getNavigationNodeSummariesSelector(state),
  display: state.home.display,
  pathKey: getKeySelector(state)
})

const mapDispatchToProps = {updateMenuState}

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

  componentDidUpdate() {
    if (this.props.catalog && !this.props.allMenuIDs) {
      const allMenuIDs = this.props.catalog.itemsData.map(item => `homemenu:${item.navigationNodeSummary}`);
      allMenuIDs.shift(); // First entry is Try Amazon Unlimited row, which has no slots to track
      this.props.updateMenuState('allMenuIDs',allMenuIDs)
    }
  }

  render() {
    if(this.props.catalog) {
      return (<Home catalog={this.props.catalog} pathKey={this.props.pathKey} topNav={TOP_NAV} focused menuid={'homespace'} onFocusItem='topnav'/>)
    } else {
      return null
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(HomeContainer)
