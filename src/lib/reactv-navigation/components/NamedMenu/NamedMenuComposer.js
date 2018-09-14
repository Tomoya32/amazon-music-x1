import React, { Component } from 'react'
import PropTypes from 'prop-types'
import KeyEvent from '../../KeyEvents'
import menuComposer from '../Menu/MenuComposer'
import { updateMenu } from '../../../reactv-redux/MenusReducer'
import { connect } from 'react-redux'
import map from 'lodash.map'
import { isFunction } from '../../utils'

const KeyEvents = new KeyEvent()
const mapDispatchToProps = {
  updateMenu
}
const mapStateToProps = (state) => {
  return {menus: state.navigation.menus}
}
const NamedMenuComposer = (InnerComponent) => {
  class NamedMenu extends Component {
    static contextTypes = {
      mid: PropTypes.string,
      getMenuId: PropTypes.func
    }
    static propTypes = {
      focused: PropTypes.bool,
      onUp: PropTypes.func,
      onDown: PropTypes.func,
      onLeft: PropTypes.func,
      onRight: PropTypes.func,
      onUpdate: PropTypes.func,
      onEnter: PropTypes.func,
      mid: PropTypes.string.isRequired
    }
    static defaultProps = {
      focused: false
    }
    static defaultState = {
      focus: null
    }

    changeFocus (name) {
      const {updateMenu, mid, menus} = this.props
      const menu = menus[mid]
      const lastFocus = (menu && menu.focus !== name) ? menu.focus : (menu) ? menu.lastFocus : null
      return () => {
        updateMenu(mid, {focus: null})  // This causes blurs to happen before focus.
        updateMenu(mid, {focus: name, lastFocus})
      }
    }

    unFocus () {
      const {updateMenu, mid, menus} = this.props
      const menu = menus[mid]
      return () => {
        updateMenu(mid, {focus: null, lastFocus: menu.focus})
      }
    }

    reFocus () {
      const {updateMenu, mid} = this.props
      const menu = this.props.menus[mid]
      return () => {
        updateMenu(mid, {focus: menu.lastFocus, lastFocus: null})
      }
    }

    componentWillMount () {
      this.checkMenuAndFocus()
    }

    checkMenuAndFocus () {

      const {defaultFocus, updateMenu, mid} = this.props
      const menu = this.props.menus[mid]
      if (!menu || (menu && !menu.focus && defaultFocus)) {
        const focus = (menu && menu.focus) ? menu.focus : defaultFocus
        updateMenu(mid, {focus})
      }
    }

    isFocused (name) {
      const menu = this.props.menus[this.props.mid]
      if (!menu) return
      // console.info(`isFocused(${name}) Is menu focused? ${this.props.focused === true ? 'yes' : 'no'} does ${menu.focus} == ${name}?`)
      return this.props.focused && menu.focus === name
    }

    componentDidMount () {
      if (this.props.focused) {
        this.bind()
        if (this.props.onFocus) this.props.onFocus()
      }
    }

    componentDidUpdate (prevProps, prevState) {
      if (!prevProps.focused && this.props.focused) {
        this.bind()
        if (this.props.onFocus) this.props.onFocus()
      } else if (prevProps.focused && !this.props.focused) {
        if (this.props.onBlur) this.props.onBlur()
        this.unbind()
      }
    }

    componentWillUnmount () {
      if (this.props.onBlur) this.props.onBlur()
      this.unbind()
    }

    bind () {
      this.unbind()
      const bindings = ['Left', 'Right', 'Up', 'Down'].reduce((mem, dir) => {
        mem[dir] = () => {
          if (isFunction(this.props[`on${dir}`])) this.props[`on${dir}`]()
        }
        return mem
      }, {})
      bindings.Enter = () => {
        if (isFunction(this.props[`onEnter`])) this.props[`onEnter}`](this.props.menuValue)
      }
      this.bindings = map(bindings, (binding, event) => {
        return KeyEvents.subscribeTo(event, binding)
      })
    }

    unbind () {
      const bindings = this.bindings || []
      bindings.forEach(binding => {
        binding.unsubscribe()
      })
    }

    render () {
      const {mid} = this.props
      const menu = this.props.menus[mid]
      const props = Object.assign({
        isFocused: this.isFocused.bind(this),
        changeFocus: this.changeFocus.bind(this),
        focus: (menu) ? menu.focus : null,
        lastFocus: (menu) ? menu.lastFocus : null
      }, this.props)
      return <InnerComponent {...props} {...this.state} />
    }
  }

  return menuComposer(connect(mapStateToProps, mapDispatchToProps)(NamedMenu))
}

export default NamedMenuComposer
