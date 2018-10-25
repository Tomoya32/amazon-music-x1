import React, {Component} from 'react'
import { KeyEvents } from '../../lib/reactv-redux'
import PropTypes from 'prop-types'

const debug = console.info

const keys = new KeyEvents('progressbar')


const Scrubbable = (InnerComponent) => {
  class ScrubbableProgressBar extends Component {
    constructor (p) {
      super(p)
      this.bindings = []
    }
    static propTypes = {
      onRight: PropTypes.func,
      onLeft: PropTypes.func,
      onUp: PropTypes.func,
      onDown: PropTypes.func,
      onEnter: PropTypes.func
    }
    componentDidMount() {
      if(this.props.focused) this.bind()
    }
    componentDidUpdate(prevProps) {
      if(this.props.focused && !prevProps.focused) this.bind()
      if(!this.props.focused && prevProps.focused) this.unbind()
    }
    componentWillUnmount() {
      this.unbind()
    }
    bind() {
      this.unbind()
      const dirs = ['Up','Down','Left', 'Right']
      dirs.forEach(event => {
        if(this.props[`on${event}`]) {
          this.bindings.push(keys.subscribeTo(event, this.props[`on${event}`]))
        }
      })
      const Enter = keys.subscribeTo('Enter', () => {
        if(this.props.onClick) this.props.onClick()
        if(this.props.onEnter) this.props.onEnter()
      })
      this.bindings.push(Enter)
      debug('Got bind for ', this.props.menuid)

    }
    unbind() {
      this.bindings.forEach(binding => binding && binding.unsubscribe && binding.unsubscribe())
      this.bindings = []
      debug('Got unbind for ', this.props.menuid)
    }
    render() {
      return <InnerComponent {...this.props} />
    }
  }
  return ScrubbableProgressBar
}
export default Scrubbable
