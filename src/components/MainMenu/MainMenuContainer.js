import React, { Component } from 'react'
import MainMenu from './MainMenu'
import { connect } from 'react-redux'
import omit from 'lodash/omit'
import { updateMenu } from '../../lib/reactv-redux/MenusReducer'
import RowMenuComposer from '../../lib/reactv-navigation/components/RowMenu/RowMenuComposer'
import topnav from './topnav'

const ComposedMenu = RowMenuComposer(MainMenu)
const mapStateToProps = ({router}) => ({pathname: router.location.pathname})

class MainMenuContainer extends Component {
  constructor (p) {
    super(p)
    this.state = {
      clicked: ''
    }
  }

  setClicked (value) {
    const {onEnter} = this.props
    onEnter(value)
  }

  render() {
    const {onEnter} = this.props
    let onSubmit = value => console.info('Value: ' + value)
    const props = omit(this.props, 'onEnter')
    if (onEnter && typeof onEnter === 'function') {
      onSubmit = value => { this.setClicked(value) }
    }
    return (<ComposedMenu {...props} menuItems={topnav} onEnter={onSubmit} clicked={this.state.clicked} />)
  }
}

export default connect(mapStateToProps)(MainMenuContainer)
