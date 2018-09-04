import React from 'react'
import ListMenu from './ListMenu'
import { KeyEvents } from '../../../reactv-redux/index'
import PropTypes from 'prop-types'

const keys = new KeyEvents()

class MenuWrapper extends React.Component {
  constructor (p) {
    super(p)
    this.state = {
      index: 0
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
    onFocusIndex: PropTypes.number
  }
  static defaultProps = {
    onFocusIndex: 0
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
      if(typeof fun === 'function') {
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

  eventBinding (index) {
    if (index >= 0 && index < this.props.data.length && index !== this.state.index) {
      this.setState({index})
    }
  }


  componentDidMount () {
    if (this.props.focused) this.bind()
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.focused && !prevState.redux_list_menu_focused) {
      if (nextProps.onFocusIndex !== prevState.index) {
        if (nextProps.onFocusIndex < 0 || nextProps.onFocusIndex >= nextProps.data.length) {
          console.warn(`Got invalid onFocusIndex of ${nextProps.onFocusIndex} max: ${nextProps.data.length - 1}`)
          return {focused: true}
        } else {
          return {index: nextProps.onFocusIndex, redux_list_menu_focused: true}
        }
      }
    } else if (!nextProps.focused && prevState.redux_list_menu_focused) {
      return {redux_list_menu_focused: false}
    }
    return null
  }

  componentWillUnmount () {
    this.unbind()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.focused && !prevProps.focused) this.bind()
    else if (!this.props.focused && prevProps.focused) this.unbind()

    if (this.state.index !== prevState.index && this.props.onChange) {
      this.props.onChange(this.state.index)
    }
  }

  increment () {
    if (this.state.index < this.props.data.length - 1) {
      this.setState({index: this.state.index + 1})
    } else if (this.props.horizontal && this.props.onRight) {
      this.props.onRight()
    }
  }

  decrement () {
    if (this.state.index > 0) {
      this.setState({index: this.state.index - 1})
    } else if (this.props.horizontal && this.props.onLeft) {
      this.props.onLeft()
    }
  }

  render () {
    const {onLeft, onRight, onUp, onDown, ...rest} = this.props
    return (<ListMenu {...rest} {...this.state} />)
  }
}

export default MenuWrapper