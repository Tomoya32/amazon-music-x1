import React, {Component} from 'react'
import { KeyEvents } from '../../../reactv-redux/index'
import PropTypes from 'prop-types'
import debugWrapper from 'debug'
const debug = debugWrapper('app:buttonizer')

const keys = new KeyEvents()

const Buttonizer = (InnerComponent) => {
  class Button extends Component {
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
      ['Up','Down','Left', 'Right','Down', 'Enter'].forEach(event => {
        if(this.props[`on${event}`]) {
          this.bindings.push(keys.subscribeTo(event, this.props[`on${event}`]))
        }
      })
      debug('Got bind for ', this.props.mid)
    }
    unbind() {
      this.bindings.forEach(binding => binding.unsubscribe())
      this.bindings = []
      debug('Got unbind for ', this.props.mid)
    }
    render() {
      return <InnerComponent {...this.props} />
    }
  }
  return Button
}
export default Buttonizer
