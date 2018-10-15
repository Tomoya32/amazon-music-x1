import React, { Component } from 'react'
import Catalog from './Catalog'
import { connect } from 'react-redux'
import { loadChildNode } from '../../store/modules/music'
import KeyEvents from '../../lib/reactv-navigation/KeyEvents'
import { replace, back } from '../../store/modules/nav'
import {  handleItemSelection } from '../../lib/utils'
import { updateMenuState } from '../../lib/reactv-redux/ReacTVReduxReducer'
import {
  getCatalogData,
  getPlayableSelector,
  getItemDescriptionsSelectors,
  getNavigationNodeSummariesSelector
} from '../../lib/selectors/node_selectors'
import PageLoading from '../../components/PageLoading'

const mapStateToProps = (state,ownProps) => ({
  menuid: `catalogmenu:${ownProps.location.pathname}${ownProps.location.hash}`,
  highlightedTrack: state.menus[`catalogmenu:${ownProps.location.pathname}${ownProps.location.hash}`],
  catalog: getCatalogData(state),
  itemDescriptions: getItemDescriptionsSelectors(state),
  playables: getPlayableSelector(state),
  navigationNodeSummaries: getNavigationNodeSummariesSelector(state)
})

const mapDispatchToProps = {loadChildNode, replace, back, updateMenuState}

const keys = new KeyEvents()

class CatalogContainer extends Component {
  constructor (p) {
    super(p)
    this.state = {};
    this.handleSelection = (dest) => {
      handleItemSelection.call(this, dest, this.props.location.pathname.replace(/^\/list\/?/,''))
    }
    this.firstNitems = 10;
  }
  componentDidMount () {
    this._unsubBack = keys.subscribeTo('Back', () => this.handleBack())
  }

  componentWillUnmount () {
    if (this._unsubBack) this._unsubBack.unsubscribe()
    this._unsubBack = null
  }

  componentDidUpdate(prevProps) {
    const { highlightedTrack, catalog, updateMenuState } = this.props;

    const longestList = this.firstNitems;
    const dataLength = this.firstNitems; // this will be ~100

    if (catalog && !this.state.catalog) {
      // should do this with getDerivedStateFromProps
      const newData = catalog.itemsData.slice(0,dataLength);
      const newState = Object.assign({}, catalog, {itemsData: newData})
      this.setState({ catalog: newState })
    }

    if (this.state.catalog && prevProps.highlightedTrack && highlightedTrack) {
      const currData = this.state.catalog.itemsData.slice(0);
      const listLength = currData.length;

      // these are just proxies for the list nodes containing preceeding and proceeding data
      const prevData = catalog.itemsData.slice(-dataLength);
      const nextData = catalog.itemsData.slice(dataLength,dataLength*2);

      // when to make adjustsment to the list
      const addLastAt = Math.floor(listLength / 4); // this will be ~25
      const rmAllAt = Math.floor(listLength / 2); // this will be ~50
      const addNextAt = Math.floor(listLength * 0.95); // this will be ~95

      // TODO:  do I have to  make some of these checks?
      // TODO: dispatch 'reactv-redux/UPDATE_MENU_STATE' with updateMenuState when deleting data
      const prevTrack = prevProps.highlightedTrack;
      const prevIdx = prevTrack.index;
      const currIdx = highlightedTrack.index;
        if (prevIdx > currIdx) { // going up
          if (currIdx == addLastAt && prevData.length) { // 25% UP
            // add last section
            currData.unshift(...prevData)
            const newState = Object.assign({}, this.props.catalog, {itemsData: currData})
            const index = currIdx + prevData.length;
            // updates redux store with correct index after prepending data to list:
            // what should my style be below?
            debugger
            updateMenuState(this.props.menuid,{
              index,
              slotIndex: highlightedTrack.slotIndex,
              maxSlot: currData.length,
              max: currData.length,
              // style: style // do I need style here?
            })
            // will the above execute, render Catalog, execute componentDidUpdate, then allow this.setState?
            this.setState({ catalog: newState })
          }
          // } else if (currIdx == rmAllAt && listLength == longestList) {
          // if (currIdx == rmAllAt && listLength == longestList) {
          //   // remove next section
          //   const newState = Object.assign({}, this.props.catalog, {itemsData: currData})
          //   this.setState({ catalog: newState })
          // }
        } else if (currIdx > prevIdx) { // going down
          // if (currIdx >= rmAllAt + dataLength && listLength == longestList) { // 50% DOWN
          //   // remove last section
          //   const newState = Object.assign({}, this.props.catalog, {itemsData: currData})
          //   // need to update global state as well
          //   this.setState({ catalog: newState })
          // }
          // } else if (currIdx == addNextAt && nextData.length) { // 75% DOWN
          if (currIdx == addNextAt && nextData.length) { // 75% DOWN
            // add next section
            currData.push(...nextData)
            const newState = Object.assign({}, this.props.catalog, {itemsData: currData})
            this.setState({ catalog: newState })
          }
        }

    }
  }


  handleBack () {
    this.props.back()
  }

  render () {
    if (typeof(this.state.catalog) === 'object') {
      let thumbnail, currentIndex;
      if (this.props.highlightedTrack) {
        currentIndex = this.props.highlightedTrack.index;
        const { itemsData } = this.state.catalog;
        if (itemsData.length) thumbnail = itemsData[currentIndex].image
      }
      const referer = (r) => { this._ref = r }
      return <Catalog {...this.state.catalog}
        passRef={referer}
        thumbnail={thumbnail}
        kid={this.props.location.pathname + this.props.location.hash}
        onSelect={this.handleSelection.bind(this)} />
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogContainer)
