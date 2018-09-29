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
import { updateMenu } from '../../lib/reactv-redux/MenusReducer'
import { updateMenuState } from '../../lib/reactv-redux/ReacTVReduxReducer'
import topnav from '../../components/MainMenu/topnav'
import { closeModal } from '../../store/modules/modal'

const mapStateToProps = (state) => ({
  showModal: state.modal.showModal,
  allMenuIDs: state.menus.allMenuIDs,
  catalog: getCatalogData(state),
  itemDescriptions: getItemDescriptionsSelectors(state),
  playables: getPlayableSelector(state),
  pathname: state.router.location.pathname,
  navigationNodeSummaries: getNavigationNodeSummariesSelector(state),
  display: state.home.display,
  pathKey: getKeySelector(state)
})

const mapDispatchToProps = {updateMenuState, updateMenu, closeModal}

class HomeContainer extends React.Component {

  componentDidUpdate() {
    if (this.props.catalog && !this.props.allMenuIDs) {
      const allMenuIDs = this.props.catalog.itemsData.map(item => `homemenu:${item.navigationNodeSummary}`);
      if (allMenuIDs[0] === "homemenu:#_obj0") {
        allMenuIDs.shift(); // First entry is Try Amazon Unlimited row, which has no slots to track
      }
      this.props.updateMenuState('allMenuIDs',allMenuIDs)
    }
  }

  render() {
    if(this.props.catalog) {
      return (<Home catalog={this.props.catalog} pathKey={this.props.pathKey} topnav={topnav} focused menuid={'homespace'} onFocusItem='topnav' {...this.props} entryFocus='home:main'/>)
    } else {
      return null
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(HomeContainer)
