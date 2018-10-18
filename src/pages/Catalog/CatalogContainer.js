import React, { Component } from 'react'
import Catalog from './Catalog'
import { connect } from 'react-redux'
import { loadChildNode, updateCurrentNode } from '../../store/modules/music'
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

const getPath = (pathname,page) => {
  // TODO: parse pathname and page into
  // '/catalog/stations' + '/page=X' + '/#prime_stations',
  // given a relative page and any current location
  let route = page.match(/\/?page=[0-9]*/);
  route = (route) ? route[0] : '';
  let key = pathname.replace(/^\/list\/*/, '/').replace(/\/page=[0-9]*/,route)
  if (key.trim() !== '' && !key.match(/\/?page=[0-9]*/)) key = `${key}/${page}`
  console.log(`pathname: ${pathname}, page: ${page}, key: ${key}`)
  return key.trim() === '' ? '/' : key
}

// TODO: add a selector for prevCatalog and nextCatalog
const mapStateToProps = (state,ownProps) => ({
  menuid: `catalogmenu:${ownProps.location.pathname}${ownProps.location.hash}`,
  highlightedTrack: state.menus[`catalogmenu:${ownProps.location.pathname}${ownProps.location.hash}`],
  catalog: getCatalogData(state),
  itemDescriptions: getItemDescriptionsSelectors(state),
  playables: getPlayableSelector(state),
  currentNode: state.music.currentNode,
  nodes: state.music.nodes, // use selector for prevCatalog and nextCatalog
  navigationNodeSummaries: getNavigationNodeSummariesSelector(state)
})

const mapDispatchToProps = {loadChildNode, replace, back, updateMenuState, updateCurrentNode}

const keys = new KeyEvents()

class CatalogContainer extends Component {
  constructor (p) {
    super(p)
    this.state = { firstNitems: 7 };
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
    const { catalog } = props;
    const dataLength = state.firstNitems; // this will be ~100
    if (catalog && (!state.catalog || state.catalog.prevPage !== catalog.prevPage)) {
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
    const { menuid, highlightedTrack, catalog, updateMenuState, page, currentNode, location: { pathname } } = this.props;

    const longestList = this.firstNitems*2;
    const dataLength = this.firstNitems; // this will be ~100

    let recentData, menuState, path; // presented data based on state and list index
    if (catalog && (!this.state.catalog || this.state.catalog.prevPage !== catalog.prevPage)) {
      recentData = catalog.itemsData.slice(0,dataLength);
      const newState = Object.assign({}, catalog, {itemsData: recentData})
      this.setState({ catalog: newState })
      this.update_state = false;
    }

    if (catalog && this.state.catalog && prevProps.highlightedTrack && highlightedTrack) {
      const { prevPage, nextPage } = this.props.catalog;
      const currData = this.state.catalog.itemsData.slice(0); // data in state
      const listLength = currData.length;

      // when to make adjustments to the infinite list
      const addPrevAt = Math.floor(this.firstNitems * 0.05); // this will be ~0
      const loadPrevAt = Math.floor(this.firstNitems * 0.25); // this will be ~96
      const rmAllAt = Math.floor(this.firstNitems * 0.50); // this will be ~50
      const loadNextAt = Math.floor(this.firstNitems * 0.75); // this will be ~96
      const addNextAt = Math.floor(this.firstNitems * 0.95); // this will be ~96

      const prevIdx = prevProps.highlightedTrack.index;
      const currIdx = highlightedTrack.index;
      if (currIdx == prevIdx - 1) { // going up
        let prevNode;
        if (prevPage) {
          path = getPath(pathname,prevPage) // sanitize path
          prevNode = this.props.nodes[path];
        }
        if (currIdx <= loadPrevAt && prevPage && !prevNode) { // load prev section
          console.log('loading prev section...')
          this.props.loadChildNode(path)
          this.update_state = false;
        } else if (currIdx == addPrevAt && prevPage && prevNode) { // prepend data
          const prevData = Object.values(prevNode.itemDescriptions).slice(0,this.firstNitems);
          recentData = prevData.concat(currData.slice(0,this.firstNitems));
          console.log('adding prev section...')
          // update redux store with correct index after prepending data to list:
          const newStyle = this.getNewStyle(prevProps, this.props, prevData.length)
          menuState = {
            index: currIdx + prevData.length, // adjust for prependata shifting current item
            slotIndex: highlightedTrack.slotIndex, // no change
            maxSlot: recentData.length-1, // adjust for more data
            max: recentData.length-1, // adjust for more data
            style: newStyle.style  // adjust for prependata shifting current item
          }
          this.update_state = true;
        } else if (currIdx == rmAllAt && this.state.catalog.itemsData.length > this.firstNitems) { // remove next section
          // TODO: destroy store data as you go
            console.log('removing next section...')
            this.props.updateCurrentNode(path);
            menuState = {
              maxSlot: dataLength-1, // adjust for less data
              max: dataLength-1, // adjust for less data
            }
            updateMenuState(menuid,menuState)
            this.update_state = false; // will already be updated by updateCurrentNode
        }
      } else if (currIdx == prevIdx + 1) { // going down
        path = getPath(pathname,nextPage) // sanitize path
        const nextNode = this.props.nodes[path];
        if (currIdx == this.firstNitems + rmAllAt && nextPage) { // remove prev section
          // TODO: destroy store data as you go
          console.log('removing prev section...')
          this.props.updateCurrentNode(path);
          const newStyle = this.getNewStyle(prevProps, this.props, -dataLength)
          menuState = {
            index: currIdx - dataLength, // adjust for cropping data from beginning, shifting current item
            slotIndex: highlightedTrack.slotIndex, // no change
            maxSlot: dataLength-1, // adjust for less data
            max: dataLength-1, // adjust for less data
            style: newStyle.style  // adjust for prependata shifting current item
          }
          updateMenuState(menuid,menuState)
          this.update_state = false; // will already be updated by updateCurrentNode
        } else if (currIdx == loadNextAt && nextPage && !nextNode) { // load next section
          console.log('loading next section...')
          this.props.loadChildNode(path)
          this.update_state = false;
        } else if (currIdx == addNextAt && nextPage && nextNode && this.state.catalog.itemsData.length <= this.firstNitems) { // add next section
          console.log('adding next section...')
          const nextData = Object.values(nextNode.itemDescriptions).slice(0,this.firstNitems);
          recentData = currData.slice(0,this.firstNitems).concat(nextData);
          menuState = {
            maxSlot: recentData.length-1, // adjust for more data
            max: recentData.length-1, // adjust for more data
          };
          this.update_state = true;
        }
      }
    }

    if (this.update_state) {
      updateMenuState(menuid,menuState)
      const newState = Object.assign({}, catalog, {itemsData: recentData})
      this.setState({ catalog: newState })
      this.update_state = false;
    }
  }

  updateState() {

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
