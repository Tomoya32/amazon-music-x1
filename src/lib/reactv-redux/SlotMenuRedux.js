import React, { Component } from 'react'
import SlotMenu from '../reactv-navigation/components/SlotMenu'
import { updateMenuState } from './ReacTVReduxReducer'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import store from '../../store'

const mapStateToProps = (state, ownProps) => ({
  current: state.menus[ownProps.menuid]
})

const mapDispatchToProps = {updateMenuState}


const clean = (input) => {
  const obj = Object.assign({}, input)
  Object.keys(obj).forEach((key) => (typeof obj[key] === 'undefined') && delete obj[key]);
  return obj
}

/**
 * Slot Menu Redux.
 * Redux wrapper to save the state of the menu in Redux Store
 */
class SlotMenuRedux extends Component {
  static propTypes = {
    menuid: PropTypes.string.isRequired,
    /** Menu ID, required unique menu id **/
    onFocusIndex: PropTypes.number,
    /** Focus index to use if there is no focus index in Redux Store **/
    onFocusSlotIndex: PropTypes.number,
    /** Focus Slot Index to use if there is no focus slot index in Redux Store **/
    style: PropTypes.object
    /** Style Object to use **/

  }

  static defaultProps = {
    onFocusIndex: 0,
    onFocusSlotIndex: 0,
    style: null
  }

  componentDidMount() {
    /** If this menu does not yet exist in the store, set its initial state **/
    if (!this.props.current) {
      const updated = {
        index: this.props.onFocusIndex,
        slotIndex: this.props.onFocusSlotIndex,
        maxSlot: this.props.slots >= this.props.data.length ? this.props.data.length - 1 : this.props.data.length,
        max: this.props.data.length - 1
      }
      if (this.props.style) updated.style = this.props.style
      this.props.updateMenuState(this.props.menuid, updated)
    }
  }

  onChange (delta) {
    delta = clean(delta)
    if(delta.index && delta.index > this.props.current.max) delta.index = this.props.current.max
    if(delta.slotIndex && delta.slotIndex > this.props.current.maxSlot) delta.slotIndex = this.props.current.maxSlot
    this.props.updateMenuState(this.props.menuid, clean(delta))
    if (this.props.onChange) this.props.onChange(delta)
  }

  getStateFromProps() {
    /** Use Redux store props if we have them, passed props or default props if we don't **/
    if(this.props.current) {
      return this.props.current
    } else {
      return {index: this.props.onFocusIndex, slotIndex: this.props.onFocusSlotIndex, style: this.props.style}
    }
  }
  render () {
    const {onChange, onFocusIndex, onFocusSlotIndex, style: oldStyles, ...rest} = this.props
    const {index, slotIndex, style} = this.getStateFromProps()
    return (<SlotMenu onFocusIndex={index} onFocusSlotIndex={slotIndex} style={style}
      onChange={this.onChange.bind(this)} {...rest} />)
  }
}

/**
 * Helper Class for Linking together slot menus so focus aligns
 */
export class SlotLinker {
  /**
   * Create a Slot Linker
   * @param {object} store - the redux store
   */
  constructor(store) {
    this.store = store
  }

  /**
   * link menus on change (and onFocus)
   * @param mid {string} - The current menu id
   * @param menuNames {(string|Array)} - Array of menu ids of linked menus
   * @returns {Function} - Function to be used in onChange and onFocus handlers
   * @example
   * render() {
   *   const { menuid, data, allMenuIds, focused, calculateStyle } = this.props
   *   const Linker = new SlotLinker(store) // Don't do this in the render function,
   *   const linker = Linker.link(menuid, allMenuIds))
   *   return (<SlotListMenu
   *            data={item.data}
   *            renderItem={ListCard}
   *            horizontal
   *            focused={focused}
                menuid={menuid}
                onChange={linker}
                onFocus={linker}
                calculateStyle={calculateStyle} />
   * }
   *
   */
  link(mid, menuNames = []) {
    return (currentState) => {
      const allMenus = this.store.getState().menus
      const theseMenus = menuNames.filter(name => name !== mid).reduce((mem, name) => {
        mem[name] = allMenus[name]
        return mem
      }, {})
      Object.keys(theseMenus).forEach(key => {
        const menu = theseMenus[key]
        let slotOffset = currentState.slotIndex - menu.slotIndex
        let newIndex = menu.index + slotOffset
        if(newIndex > menu.max) newIndex = menu.max
        let newSlot = menu.slotIndex + slotOffset
        if (newSlot > menu.maxSlot) newSlot = menu.maxSlot
        const newState = {index: newIndex, slotIndex: newSlot}
        this.store.dispatch(updateMenuState(key, newState))
      })
    }
  }
}

export const getWidthWithMargin = (c) => {
  const style = window.getComputedStyle ? getComputedStyle(c) : c.currentStyle
  const width = c.getBoundingClientRect().width + parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10)
  return width
}

export const getHeightMargin = (c) => {
  const style = window.getComputedStyle ? getComputedStyle(c) : c.currentStyle
  const height = c.getBoundingClientRect().height + parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10) + 32
  return height
}

/**
 * Helper to calculate the offset of a menu based on index and slot index.
 * @param ref
 * @param index
 * @param slotIndex
 * @returns {*}
 */
export const calculateOffset = (ref, index, slotIndex) => {
  if (!ref) return null
  const itemsOffset = index - slotIndex
  return Array.from(ref.childNodes).slice(0, itemsOffset).reduce((mem, c) => (mem += getWidthWithMargin(c)), 0)
}

export const calculateOffsetWidth = calculateOffset

export const calculateOffsetHeight = (ref, index, slotIndex) => {
  if (!ref) return null
  const itemsOffset = index - slotIndex
  return Array.from(ref.childNodes).slice(0, itemsOffset).reduce((mem, c) => (mem += getHeightMargin(c)), 0)
}
export default connect(mapStateToProps, mapDispatchToProps)(SlotMenuRedux)
