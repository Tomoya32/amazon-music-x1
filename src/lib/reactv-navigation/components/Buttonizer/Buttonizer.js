import React, {Component} from 'react'
import { KeyEvents } from '../../../reactv-redux/index'
import PropTypes from 'prop-types'

const keys = new KeyEvents('buttonizer')


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

    bind() {
      console.info('binding enter')
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
    }
    unbind() {
      console.info('unbinding keys', this.bindings)
      this.bindings.forEach(binding => binding.unsubscribe())
      this.bindings = []
    }
    render() {
      return <InnerComponent {...this.props} />
    }
  }
  return Button
}
export default Buttonizer