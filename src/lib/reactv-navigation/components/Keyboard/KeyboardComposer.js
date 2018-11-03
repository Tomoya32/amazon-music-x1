import React from 'react'
import PropTypes from 'prop-types'
import { isFunction } from '../../utils'
import { updateMenu } from '../../../reactv-redux/MenusReducer'
import MenuComposer from '../Menu/MenuComposer'
import { connect } from 'react-redux'
import KeyEvent from '../../KeyEvents'
import map from 'lodash/map'
import omit from 'lodash/omit'
const debug = console.info

const KeyEvents = new KeyEvent()

const KeyboardComposer = (InnerComponent) => {
  class Keyboard extends React.Component {
    constructor (p) {
      super(p)
      this._bound = false
    }

    static contextTypes = {
      mid: PropTypes.string,
      getMenuId: PropTypes.func
    }

    static propTypes = {
      focused: PropTypes.bool,
      mid: PropTypes.string,
      menus: PropTypes.object,
      updateMenu: PropTypes.func,
      onUpdate: PropTypes.func,
      menuItems: PropTypes.array
    }

    componentDidUpdate (prevProps) {
      if (!prevProps.focused && this.props.focused) this.bind()
      else if (prevProps.focused && !this.props.focused) this.unbind()
      const menu = this.props.menus[this.props.mid]
      const oldMenu = prevProps.menus[this.props.mid]
      if (menu && oldMenu && menu.index !== oldMenu.index && isFunction(this.props.onUpdate)) {
        this.props.onUpdate(this.props.mid, menu)
      }
      if (prevProps.contentKey && this.props.contentKey && prevProps.contentKey !== this.props.contentKey) {
        console.info('new menu items based on contentKey, resetting index for', this.props.mid)
        this.props.updateMenu(this.props.mid, {index: 0})
      }
    }

    componentDidMount () {
      setTimeout(() => {
        if (this.props.focused && !this._bound && ! this._unmounted) {
          debug('not bound but focused, trying to bind ...')
          this.bind()
        }
      }, 100)
    }

    componentWillMount () {
      this.checkMenuAndMax()
    }

    componentWillUpdate (nextProps) {
      this.checkMenuAndMax(nextProps)
    }

    componentWillUnmount () {
      this._unmounted = true;
      this.unbind()
    }

    checkMenuAndMax (props) {
      props = props || this.props
      const {mid, updateMenu} = props
      const menu = props.menus[mid]
      if (!menu) {
        updateMenu(mid, {index: 0, max: this.getMax()})
      } else {
        const max = this.getMax(props)
        if (menu.max !== max) {
          if (menu.index > max) menu.index = max
          menu.max = max
          updateMenu(mid, menu)
        }
      }
    }

    getMax (props) {
      props = props || this.props
      let max = 0
      let childCount = props.children ? React.Children.count(props.children) : null
      if (this.props.menuItems && Array.isArray(props.menuItems)) {
        max = props.menuItems.length - 1
      } else if (Number.isInteger(this.props.menuItems)) {
        max = props.menuItems - 1
      } else if (childCount && childCount > 0) {
        max = childCount - 1
      }
      return max
    }

    bind () {
      debug('Got bind for grid', this.props.mid)
      const handlers = {
        Enter: () => {
          console.info('Got enter for ', this.props.mid)
          this.handleOnClick()
        }
      }

      const {menus, mid} = this.props
      const menu = menus[mid]

      const incrementHandler = 'Right'
      const decrementHandler = 'Left'
      const upHandler = 'Up'
      const downHandler = 'Down'

      handlers[decrementHandler] = () => {
        const {menus, mid} = this.props
        const menu = menus[mid]
        const handler = `on${decrementHandler}`
        if (this.props.focused && menu.index > 0) {
          this.props.updateMenu(mid, {index: menu.index - 1})
        } else if (isFunction(this.props[handler])) {
          this.props[handler]()
        }
      }

      handlers[incrementHandler] = () => {
        const {menus, mid} = this.props
        const index = menus[mid].index
        const handler = `on${incrementHandler}`
        const maxIndex = this.getMax()

        if (typeof this.props.onDown === 'function' && (index === 5 || index === 11 || index === 17 || index === 23 || index === 29 || index === 35 || index === 37)) {
          this.props.onDown()
          return
        }

        if (index < maxIndex) {
          this.props.updateMenu(mid, {index: index + 1})
        } else if (isFunction(this.props[handler])) {
          this.props[handler]()
        }
      }

      handlers[upHandler] = () => {
        const {menus, mid} = this.props
        const index = menus[mid].index
        const handler = `on${upHandler}`
        const maxIndex = this.getMax()

        if (index < 6) {
          this.props.onUp()
          return
        }

        if (index === maxIndex) {
          // for delete key
          this.props.updateMenu(mid, {index: index - 3})
          return
        }

        this.props.updateMenu(mid, {index: index - 6})
      }

      handlers[downHandler] = () => {
        const {menus, mid} = this.props
        const index = menus[mid].index
        const handler = `on${upHandler}`
        const maxIndex = this.getMax()

        if (index > 35) {
          if (this.props.onDown) {
            this.props.onDown()
          } else {
            this.props.updateMenu(mid, {index: 0})
          }
          return
        }

        if (index === 30 || index === 31 || index === 32 || index === 33) {
          // for space key
          this.props.updateMenu(mid, {index: 36})
          return
        }

        if (index === 35 || index === 34) {
          // for delete key
          this.props.updateMenu(mid, {index: 37})
          return
        }

        this.props.updateMenu(mid, {index: index + 6})
      }

      this.unbind()
      this.bindings = map(handlers, (binding, event) => {
        return KeyEvents.subscribeTo(event, (evt) => {
          binding(evt)
        })
      })
      this._bound = true
    }

    handleOnClick () {
      const {menus, mid, onClick, menuItems, onEnter} = this.props
      if (!isFunction(onClick) && !isFunction(onEnter)) return
      const menu = menus[mid]
      let {index} = menu
      let payload = []
      if (Array.isArray(menuItems)) {
        payload = [menuItems[index], index]
      } else {
        payload.push(index)
      }
      console.info('Triggering with payload ', payload)
      if (isFunction(onEnter)) onEnter.apply(this, payload)
      if (isFunction(onClick)) onClick.apply(this, payload)
    }

    unbind () {
      debug('Got unbind for ', this.props.mid)
      const bindings = this.bindings || []
      bindings.forEach(binding => binding.unsubscribe())
      this._bound = false
    }

    isFocused (idx, rowInd) {
      const {mid, menus, focused} = this.props
      const menu = menus[mid]
      return !!(menu && focused && menu.index === idx)
    }

    claimFocus (idx) {
      const {mid, updateMenu} = this.props
      updateMenu(mid, {index: idx})
    }

    mergeProps (idx, props = {}) {
      const newProps = Object.assign({}, props)
      newProps.onMouseOver = () => {
        if (isFunction(props.onMouseOver)) props.onMouseOver()
        this.claimFocus(idx)
      }
      newProps.focused = this.isFocused(idx)
      return newProps
    }

    getPassedProps () {
      let props = Object.assign({}, {
        menu: this.props.menus[this.props.mid],
        isFocused: this.isFocused.bind(this),
        mergeProps: this.mergeProps.bind(this)
      }, this.props)

      props.children = React.Children.map(props.children, (child, idx) => {
        const props = this.mergeProps(idx, child.props)
        return React.cloneElement(child, props)
      })

      return omit(props, ['menus'])
    }

    render () {
      const props = this.getPassedProps()
      if (!props.menu) return null
      return <InnerComponent {...props} {...this.state} />
    }
  }

  return MenuComposer(connect((state) => {
    return {menus: state.navigation.menus}
  }, {updateMenu})(Keyboard))
}
export default KeyboardComposer
