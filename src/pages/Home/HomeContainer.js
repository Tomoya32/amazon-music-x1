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
import { loadChildNode } from '../../store/modules/music'

const mapStateToProps = (state, props) => ({
  showModal: state.modal.showModal,
  fading: state.modal.fading,
  allMenuIDs: getMenuIDsSelector(state),
  catalog: getCatalogData(state),
  itemDescriptions: getItemDescriptionsSelectors(state),
  playables: getPlayableSelector(state),
  pathname: state.router.location.pathname,
  navigationNodeSummaries: getNavigationNodeSummariesSelector(state),
  display: state.home.display,
  pathKey: getKeySelector(state),
  nodes: state.music.nodes
})

const mapDispatchToProps = {updateMenu, closeModal, loadChildNode}

class HomeContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      itemsHaveBeenFetched: false
    }
  }

  componentDidMount () {
    this.loadIfNeeded()
  }

  componentDidUpdate () {
    this.loadIfNeeded()
  }

  loadIfNeeded () {
    if (this.props.catalog && !this.state.itemsHaveBeenFetched) {

      const lists = Object.keys(this.props.navigationNodeSummaries)
      lists.map(item => {
        let string = this.props.navigationNodeSummaries[item].description
        let toIndex = string.indexOf('#')
        string = string.slice(2, toIndex - 1)
        this.props.loadChildNode(string)
      })

      this.setState({
        itemsHaveBeenFetched: true
      })
    }
  }

  render () {
    if (this.props.catalog) {
      const lists = Object.keys(this.props.navigationNodeSummaries)
      const paths = []
      lists.map(item => {
        let string = this.props.navigationNodeSummaries[item].description
        let toIndex = string.indexOf('#')
        string = string.slice(2, toIndex - 1)
        paths.push(string)
      })

      let renderHome = true

      paths.map(item => {
        // idescreen_catalog_des is 'Tracks just for you'. Loading extremely slow and because of that they're excluded here
        // idescreen_library_des is something in 'MY MISIC'. Loading extremely slow and because of that they're excluded here
        if (!this.props.nodes[item] && item !== 'idescreen_catalog_des' && item !== 'idescreen_library_des') {
          renderHome = false
        }
      })

      if (renderHome) {
        return (<Home
          catalog={this.props.catalog}
          pathKey={this.props.pathKey}
          topnav={topnav}
          focused
          menuid={'homespace'}
          onFocusItem='topnav'
          {...this.props}
          entryFocus='home:main'
        />)
      }
    }

    return (<PageLoading />)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
