import React  from 'react'
import Home from './Home'
import {connect} from 'react-redux'
import {
  getMenuIDsSelector,
  getCatalogData,
  getPlayableSelector,
  getItemDescriptionsSelectors,
  getNavigationNodeSummariesSelector,
  getKeySelector
} from '../../lib/selectors/node_selectors'
import { updateMenu } from '../../lib/reactv-redux/MenusReducer'
import topnav from '../../components/MainMenu/topnav'
import { closeModal } from '../../store/modules/modal'
import PageLoading from '../../components/PageLoading'

const mapStateToProps = (state) => ({
  showModal: state.modal.showModal,
  allMenuIDs: getMenuIDsSelector(state),
  catalog: getCatalogData(state),
  itemDescriptions: getItemDescriptionsSelectors(state),
  playables: getPlayableSelector(state),
  pathname: state.router.location.pathname,
  navigationNodeSummaries: getNavigationNodeSummariesSelector(state),
  display: state.home.display,
  pathKey: getKeySelector(state)
})

const mapDispatchToProps = {updateMenu, closeModal}

class HomeContainer extends React.Component {

  render() {
    if(this.props.catalog) {
      return (<Home catalog={this.props.catalog} pathKey={this.props.pathKey} topnav={topnav} focused menuid={'homespace'} onFocusItem='topnav' {...this.props} entryFocus='home:main'/>)
    } else {
      return (<PageLoading />)
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(HomeContainer)
