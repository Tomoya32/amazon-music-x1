import React, {Component} from 'react'

const SpaceComposer = (InnerComponent) => {
  class Space extends Component {
    constructor (p) {
      super(p)
      this.state = {
        currentFocus: 'playback:playercontrols:pause',
      }
    }

    static getDerivedStateFromProps (nextProps, prevState) {
      if (nextProps.focused && !prevState.redux_space_menu_focused) {
        const out = {redux_space_menu_focused: true}
        if (nextProps.onFocusItem) {
          out.currentFocus = nextProps.onFocusItem
        }
        return out
      } else if (!nextProps.focused && prevState.redux_space_menu_focused) {
        return {redux_space_menu_focused: false}
      }
      return null
    }


    updateFocus(currentFocus) {
      this.setState({currentFocus: null})
      this.setState({currentFocus})
      if(this.props.onChange) this.props.onChange(currentFocus)
    }

    changeFocus(mid) {
      return () => this.updateFocus(mid)
    }

    isFocused(mid) {
      return (this.state.currentFocus === mid && this.props.focused)
    }
    render() {
      return <InnerComponent isFocused={this.isFocused.bind(this)} changeFocus={this.changeFocus.bind(this)} updateFocus={this.updateFocus.bind(this)} {...this.props} />
    }
  }
  return Space
}
export default SpaceComposer
