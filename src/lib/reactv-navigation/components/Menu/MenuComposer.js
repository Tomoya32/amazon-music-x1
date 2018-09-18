import React from 'react'
import { guid } from '../../utils'
import PropTypes from 'prop-types'

const menuComposer = (Component) => {
  class MenuComponent extends React.Component {
    static propTypes = {
      mid: PropTypes.string.isRequired
    }
    static childContextTypes = {
      mid: PropTypes.string,
      getMenuId: PropTypes.func
    }
    getChildContext () {
      return {
        mid: this.props.mid,
        getMenuId: (param) => `${this.props.mid}:${param}`
      }
    }
    constructor (props) {
      super(props)
      this.mid = props.mid || guid()
    }

    render () {
      const props = Object.assign({}, this.props, {mid: this.mid || guid()})
      return <Component {...props} {...this.state} />
    }
  }
  return MenuComponent
}

export default menuComposer
