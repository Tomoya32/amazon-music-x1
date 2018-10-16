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
  // TODO:  This component needs to be connected to the redux store and load that data as the user scrolls
  constructor (p) {
    super(p)
    this.state = { firstNitems: 100 };
    this.handleSelection = (dest) => {
      handleItemSelection.call(this, dest, this.props.location.pathname.replace(/^\/list\/?/,''))
    }
    this.firstNitems = this.state.firstNitems;
    this.update_state = false;
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
    const newStyle = {index, slotIndex}
    const calStyle = this.calculateStyle({
      index: oldIndex,
      slotIndex: oldSlotIndex
    }, {index: index + extendBy, slotIndex}, this._ref)
    if (calStyle !== null) {
      const updatedStyle = Object.assign({}, style || {}, calStyle)
      newStyle.style = updatedStyle
    }
    if (calStyle === null) console.info('newStyle: ', newStyle)

    return newStyle
  }

  static getDerivedStateFromProps(props, state) {
    // this is a special case for an incomplete infinite list.
    const { catalog } = props;
    const dataLength = state.firstNitems; // this will be ~100
    if (catalog && !state.catalog) {
      let newData = catalog.itemsData.slice(0,dataLength);
      if (props.highlightedTrack && props.highlightedTrack.index >= state.firstNitems) {
        newData = newData.concat(newData)
      }
      const newState = Object.assign({}, catalog, {itemsData: newData})
      return { catalog: newState }
    }
    return null
  }

  componentDidUpdate(prevProps) {
    const { menuid, highlightedTrack, catalog, updateMenuState } = this.props;

    const longestList = this.firstNitems*2;
    const dataLength = this.firstNitems; // this will be ~100

    let recentData; // presented data based on state and list index

    if (catalog && !this.state.catalog) {
      recentData = catalog.itemsData.slice(0,dataLength);
      this.update_state = true;
    }

    if (this.state.catalog && prevProps.highlightedTrack && highlightedTrack) {
      const currData = this.state.catalog.itemsData.slice(0); // data in state
      const listLength = currData.length;

      // these are just proxies for the list nodes containing preceeding and proceeding data
      const prevData = catalog.itemsData.slice(-dataLength);
      const nextData = catalog.itemsData.slice(dataLength,dataLength*2);

      // when to make adjustments to the infinite list
      const addLastAt = 0; // this will be ~0
      const rmAllAt = Math.floor(this.firstNitems / 2); // this will be ~50
      const addNextAt = Math.floor(this.firstNitems * 0.75); // this will be ~96

      const prevIdx = prevProps.highlightedTrack.index;
      const currIdx = highlightedTrack.index;
      if (prevIdx > currIdx) { // going up
        if (currIdx == addLastAt && prevData.length) { // prepend data
          recentData = prevData.slice(0).concat(currData);
          // update redux store with correct index after prepending data to list:
          const newStyle = this.getNewStyle(prevProps, this.props, prevData.length)
          updateMenuState(menuid,{
            index: currIdx + prevData.length, // adjust for prependata shifting current item
            slotIndex: highlightedTrack.slotIndex, // no change
            maxSlot: recentData.length-1, // adjust for more data
            max: recentData.length-1, // adjust for more data
            style: newStyle.style  // adjust for prependata shifting current item
          })
          this.update_state = true;
        } else if (currIdx == rmAllAt && listLength == longestList) { // remove next section
          recentData = currData.slice(0,this.firstNitems); // first bit of state.catalog data
          updateMenuState(menuid,{
            maxSlot: recentData.length-1, // adjust for less data
            max: recentData.length-1, // adjust for less data
          })
          this.update_state = true;
        }
      } else if (currIdx > prevIdx) { // going down
        if (currIdx == this.firstNitems + rmAllAt) { // remove last section
          recentData = currData.slice(this.firstNitems); // last bit of state.catalog data
          const newStyle = this.getNewStyle(prevProps, this.props, -prevData.length)
          updateMenuState(menuid,{
            index: currIdx - prevData.length, // adjust for cropping data from beginning, shifting current item
            slotIndex: highlightedTrack.slotIndex, // no change
            maxSlot: recentData.length-1, // adjust for less data
            max: recentData.length-1, // adjust for less data
            style: newStyle.style  // adjust for prependata shifting current item
          })
          this.update_state = true;
        } else if (currIdx == addNextAt && nextData.length) { // add next section
          recentData = currData.concat(nextData);
          updateMenuState(menuid,{
            maxSlot: recentData.length-1, // adjust for less data
            max: recentData.length-1, // adjust for less data
          })
          this.update_state = true;
        }
      }
    }

    if (this.update_state) {
      const newState = Object.assign({}, catalog, {itemsData: recentData})
      this.setState({ catalog: newState })
      this.update_state = false;
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
        // if (itemsData.length && !itemsData[currentIndex]) debugger
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
