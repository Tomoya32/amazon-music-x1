import React from 'react'
import SlotMenu from './SlotMenu'
import { KeyEvents } from '../../../reactv-redux/index'
import PropTypes from 'prop-types'

const keys = new KeyEvents()

class MenuWrapper extends React.Component {
  constructor (p) {
    super(p)
    this.state = {
      index: 0, slotIndex: 0, style: p.style
    }
    this.bindings = []
  }

  static propTypes = {
    onChange: PropTypes.func,
    onRight: PropTypes.func,
    onLeft: PropTypes.func,
    onUp: PropTypes.func,
    onDown: PropTypes.func,
    eventBinder: PropTypes.func,
    onFocusIndex: PropTypes.number,
    slots: PropTypes.number.isRequired,
    calculateStyle: PropTypes.func
  }
  static defaultProps = {
    onFocusIndex: 0, onFocusSlotIndex: 0
  }

  bind () {
    this._inc = keys.subscribeTo((this.props.horizontal ? 'Left' : 'Up'), () => {
      this.decrement()
    })
    this._dec = keys.subscribeTo((this.props.horizontal ? 'Right' : 'Down'), () => {
      this.increment()
    })
    if (this.props.horizontal) {
      if (this.props.onUp) this._offside1 = keys.subscribeTo('Up', this.props.onUp)
      if (this.props.onDown) this._offside2 = keys.subscribeTo('Down', this.props.onDown)
    }
    else {
      if (this.props.onRight) this._offside1 = keys.subscribeTo('Right', this.props.onRight)
      if (this.props.onLeft) this._offside2 = keys.subscribeTo('Left', this.props.onLeft)
    }
    this.click = keys.subscribeTo('Enter', () => {
      const fun = this.props.onEnter || this.props.onClick
      if (typeof fun === 'function') {
        fun(this.props.data[this.state.index], this.props.index)
      }
    })
  }

  unbind () {
    if (this._inc) this._inc.unsubscribe()
    if (this._dec) this._dec.unsubscribe()
    if (this._offside1) this._offside1.unsubscribe()
    if (this._offside2) this._offside2.unsubscribe()
    if (this.click) this.click.unsubscribe()
  }

  componentDidMount () {
    if (this.props.focused) this.bind()
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.focused && !prevState.redux_list_menu_focused) {
      if (nextProps.onFocusIndex !== prevState.index) {
        if (nextProps.onFocusIndex < 0 || nextProps.onFocusIndex >= nextProps.data.length) {
          console.warn(`Got invalid onFocusIndex of ${nextProps.onFocusIndex} max: ${nextProps.data.length - 1}`)
          return {redux_list_menu_focused: true}
        } else {
          let focusSlot = 0
          if (nextProps.onFocusSlotIndex < 0 || nextProps.onFocusSlotIndex >= nextProps.slots) {
            console.warn('got invalid slot index of ' + nextProps.onFocusSlotIndex + ' setting to 0')
          } else {
            // Dont set slot 3 focused if only 2 items
            if (nextProps.onFocusSlotIndex > nextProps.data.length) focusSlot = nextProps.data.length - 1
            else focusSlot = nextProps.onFocusSlotIndex
          }
          return {
            index: nextProps.onFocusIndex,
            redux_list_menu_focused: true,
            slotIndex: focusSlot,
            style: nextProps.style
          }
        }
      } else {
        return {redux_list_menu_focused: nextProps.focused}
      }
    } else if (!nextProps.focused && prevState.redux_list_menu_focused) {
      return {
        redux_list_menu_focused: false
      }
    } else if (nextProps.focused && prevState.redux_list_menu_focused) {
      if (nextProps.onFocusIndex > prevState.index + 1) {
        return {
          index: nextProps.onFocusIndex,
          slotIndex: nextProps.onFocusSlotIndex,
          style: nextProps.style
        }
      } else if (nextProps.onFocusIndex < prevState.index - 1) {
        return {
          index: nextProps.onFocusIndex,
          slotIndex: nextProps.onFocusSlotIndex,
          style: nextProps.style
        }
      }
    }
    return null
  }

  componentWillUnmount () {
    this.unbind()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.focused && !prevProps.focused) {
      if (typeof this.props.onFocus === 'function') {
        this.props.onFocus(
          {index: this.state.index, slotIndex: this.state.slotIndex, style: this.state.style},
          {index: prevState.index, slotIndex: prevState.slotIndex, style: prevState.style},
          this._ref
        )
      }
      this.bind()
    }
    else if (!this.props.focused && prevProps.focused) {
      if (typeof this.props.onBlur === 'function') {
        this.props.onBlur(
          {index: this.state.index, slotIndex: this.state.slotIndex, style: this.state.style},
          {index: prevState.index, slotIndex: prevState.slotIndex, style: prevState.style},
          this._ref
        )
      }
      this.unbind()
    }

    if (this.state.index !== prevState.index && this.props.focused) {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(
          {index: this.state.index, slotIndex: this.state.slotIndex, style: this.state.style},
          {index: prevState.index, slotIndex: prevState.slotIndex, style: prevState.style},
          this._ref
        )
      }
    }
  }

  updateMenuState (index, slotIndex) {
    const change = {index, slotIndex}
    if (typeof (this.props.calculateStyle) === 'function') {
      const newStyle = this.props.calculateStyle({
        index: this.state.index,
        slotIndex: this.state.slotIndex
      }, {index, slotIndex}, this._ref)
      if (newStyle !== null) {
        const updatedStyle = Object.assign({}, this.props.style || {}, newStyle)
        change.style = updatedStyle
      }
      if (newStyle === null) console.info('change', change)
    }

    this.setState(change)
  }

  increment () {
    if (this.state.index < this.props.data.length - 1) {
      const slotIndex = this.state.slotIndex < this.props.slots - 1 ? this.state.slotIndex + 1 : this.state.slotIndex
      this.updateMenuState(this.state.index + 1, slotIndex)
    } else if (this.props.horizontal && typeof this.props.onRight === 'function') {
      this.props.onRight()
    }
  }

  decrement () {
    if (this.state.index > 0) {
      const slotIndex = this.state.slotIndex > 0 ? this.state.slotIndex - 1 : this.state.slotIndex
      this.updateMenuState(this.state.index - 1, slotIndex)
    } else if (this.props.horizontal && typeof this.props.onLeft === 'function') {
      this.props.onLeft()
    } else if (this.props.onUp) {
      this.props.onUp()
    }
  }

  render () {
    const {onLeft, onRight, onUp, onDown, passRef, style = {}, ...rest} = this.props
    const referer = (r) => {
      this._ref = r
      if (typeof passRef === 'function') passRef(r)
    }
    return (<SlotMenu {...rest} {...this.state} style={this.state.style} passRef={referer} />)
  }
}

export default MenuWrapper
