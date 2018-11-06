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
import { noha, mergePath } from '../../lib/utils'
import up from 'url-parse'

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

  getNode (item) {
    let summary = this.props.navigationNodeSummaries[item];
    if (summary.description.indexOf('#') === 0) {
      const description = noha(summary.description).replace(/_desc$/,'');
      return `/${description}/`
    } else {
      const path = mergePath('/widescreen_catalog/', summary.description)
      return up(path).pathname
    }
  }

  loadIfNeeded () {
    if (this.props.catalog && !this.state.itemsHaveBeenFetched) {

      const lists = Object.keys(this.props.navigationNodeSummaries)
      lists.map((item,index) => {
        const string = this.getNode(item)
        this.props.loadChildNode(string)
        if (index === lists.length-1) console.log(`Loading ${lists.length} rows`)
      })

      this.setState({
        itemsHaveBeenFetched: true
      })
    }
  }

  render () {
    if (this.props.catalog) {
      const lists = Object.keys(this.props.navigationNodeSummaries)
      let renderHome = false
      const noNodePaths = {
        '/upsell-banner/': true,
        // TODO: figure out why /library/playlists is filtered out by selectors in (node_selectors)
        // and remove this node from noNodePaths
        "/library/playlists": true
      }
      let count = 0;
      lists.map((item, index) => {
        const string = this.getNode(item)
        const node = this.props.nodes[string];
        if (node && node.result || noNodePaths[string]) count++
        if (count === lists.length) renderHome = true;
        else console.log(`Still loading nodes...`)
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
