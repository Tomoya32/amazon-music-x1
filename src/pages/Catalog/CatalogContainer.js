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
import {calculateOffsetHeight} from '../../lib/reactv-redux/SlotMenuRedux'

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
    this.firstNitems = 20;
  }
  componentDidMount () {
    this._unsubBack = keys.subscribeTo('Back', () => this.handleBack())
  }

  componentWillUnmount () {
    if (this._unsubBack) this._unsubBack.unsubscribe()
    this._unsubBack = null
  }

  calculateStyle (currentState, newState, ref) {
    if (newState.index > currentState.index) {
      return {transform: `translateY(-${calculateOffsetHeight(ref, newState.index, newState.slotIndex)}px)`}
    } else if (newState.index < currentState.index) {
      return {transform: `translateY(-${calculateOffsetHeight(ref, newState.index, newState.slotIndex)}px)`}
    } else {
      return null
    }
  }

  getNewStyle ({highlightedTrack: {index: oldIndex, slotIndex: oldSlotIndex, style}},{highlightedTrack: {index, slotIndex}}, extendBy) {
    const change = {index, slotIndex}
    const newStyle = this.calculateStyle({
      index: oldIndex,
      slotIndex: oldSlotIndex
    }, {index: index + extendBy, slotIndex}, this._ref)
    if (newStyle !== null) {
      const updatedStyle = Object.assign({}, style || {}, newStyle)
      change.style = updatedStyle
    }
    if (newStyle === null) console.info('change', change)

    return change
  }

  componentDidUpdate(prevProps) {
    const { menuid, highlightedTrack, catalog, updateMenuState } = this.props;

    const longestList = this.firstNitems*2;
    const dataLength = this.firstNitems; // this will be ~100

    if (catalog && !this.state.catalog) {
      // should probably do this with getDerivedStateFromProps
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
      const addLastAt = 0; // this will be ~0
      const rmAllAt = Math.floor(this.firstNitems / 2); // this will be ~50
      const addNextAt = Math.floor(this.firstNitems * 0.75); // this will be ~96

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
            // updates redux store with correct index after prepending data to list:
            const newStyle = this.getNewStyle(prevProps, this.props, prevData.length)
            updateMenuState(menuid,{
              index: currIdx + prevData.length, // adjust for prependata shifting current item
              slotIndex: highlightedTrack.slotIndex, // no change
              maxSlot: currData.length-1, // adjust for more data
              max: currData.length-1, // adjust for more data
              style: newStyle.style  // adjust for prependata shifting current item
            })
            this.setState({ catalog: newState })
          } else if (currIdx == rmAllAt && listLength == longestList) { // 50% UP
            // remove next section
            const recentData = this.state.catalog.itemsData.slice(0,this.firstNitems); // first bit of state.catalog data
            const newState = Object.assign({}, this.props.catalog, {itemsData: recentData})
            updateMenuState(menuid,{
              maxSlot: recentData.length-1, // adjust for less data
              max: recentData.length-1, // adjust for less data
            })
            this.setState({ catalog: newState })
          }
        } else if (currIdx > prevIdx) { // going down
          if (currIdx == this.firstNitems + rmAllAt) { // 50% DOWN
            // remove last section
            const recentData = this.state.catalog.itemsData.slice(this.firstNitems); // last bit of state.catalog data
            const newState = Object.assign({}, this.props.catalog, {itemsData: recentData})
            const newStyle = this.getNewStyle(prevProps, this.props, -prevData.length)
            updateMenuState(menuid,{
              index: currIdx - prevData.length, // adjust for cropping data from beginning, shifting current item
              slotIndex: highlightedTrack.slotIndex, // no change
              maxSlot: recentData.length-1, // adjust for less data
              max: recentData.length-1, // adjust for less data
              style: newStyle.style  // adjust for prependata shifting current item
            })
            this.setState({ catalog: newState })
          } else if (currIdx == addNextAt && nextData.length) { // 75% DOWN
            // add next section
            currData.push(...nextData)
            const newState = Object.assign({}, this.props.catalog, {itemsData: currData})
            updateMenuState(menuid,{
              maxSlot: currData.length-1, // adjust for less data
              max: currData.length-1, // adjust for less data
            })
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
