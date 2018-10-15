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
    this.longestList = 20;
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
    const longestList = this.longestList;
    const dataLength = Math.floor(longestList / 2); // this will be ~100
    const addLastAt = Math.floor(longestList / 8); // this will be ~25
    const rmAllAt = Math.floor(longestList / 4); // this will be ~50
    const addNextAt = Math.floor(longestList / 2 * 0.95); // this will be ~95

    if (catalog && !this.state.catalog) {
      const newData = catalog.itemsData.slice(0,dataLength);
      const newState = Object.assign({}, catalog, {itemsData: newData})
      this.setState({ catalog: newState })
    }

    if (this.state.catalog) {
      const itemsCount = this.state.catalog.itemsData.length;
      const prevData = catalog.itemsData.slice(-dataLength);
      let newData = catalog.itemsData.slice(0,dataLength);
      const nextData = catalog.itemsData.slice(dataLength,dataLength*2);
      // TODO:  do I have to  make some of these checks?
      // TODO: dispatch 'reactv-redux/UPDATE_MENU_STATE' with updateMenuState when deleting data

      if (prevProps.highlightedTrack && highlightedTrack) {
        const prevIdx = prevProps.highlightedTrack.index;
        const currIdx = highlightedTrack.index;
          if (prevIdx > currIdx) { // going up
            if (currIdx <= addLastAt && itemsCount < longestList) { // 25% UP
              // add last section
              prevData.push(...newData)
              const newState = Object.assign({}, this.props.catalog, {itemsData: prevData})
              updateMenuState(this.props.menuid,{
                index: currIdx + dataLength,
                slotIndex: 2,
                maxSlot: longestList,
                max: longestList
              })
              // will the above execute, render Catalog, execute componentDidUpdate, then allow this.setState?
              this.setState({ catalog: newState })
            }
            // } else if (currIdx == rmAllAt && itemsCount == longestList) {
            // if (currIdx == rmAllAt && itemsCount == longestList) {
            //   // remove next section
            //   const newState = Object.assign({}, this.props.catalog, {itemsData: newData})
            //   this.setState({ catalog: newState })
            // }
          } else if (currIdx > prevIdx) { // going down
            if (currIdx >= rmAllAt + dataLength && itemsCount == longestList) { // 50% DOWN
              // remove last section
              const newState = Object.assign({}, this.props.catalog, {itemsData: newData})
              this.setState({ catalog: newState })
            }
            // } else if (currIdx == addNextAt && itemsCount < longestList) { // 75% DOWN
            // if (currIdx == addNextAt && itemsCount < longestList) { // 75% DOWN
            //   // add next section
            //   newData.push(...nextData)
            //   const newState = Object.assign({}, this.props.catalog, {itemsData: newData})
            //   this.setState({ catalog: newState })
            // }
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
      return <Catalog {...this.state.catalog}
        thumbnail={thumbnail}
        kid={this.props.location.pathname + this.props.location.hash}
        onSelect={this.handleSelection.bind(this)} />
    } else {
      return null
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogContainer)
