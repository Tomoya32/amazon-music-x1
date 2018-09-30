import React, { Component } from 'react'
import MainMenu from './MainMenu'
import { connect } from 'react-redux'
import omit from 'lodash/omit'
import RowMenuComposer from '../../lib/reactv-navigation/components/RowMenu/RowMenuComposer'

const ComposedMenu = RowMenuComposer(MainMenu)
const mapStateToProps = ({router, playable}) => ({pathname: router.location.pathname, playable})

class MainMenuContainer extends Component {
  constructor(props){
    super(props)
    this.state = {topnav: props.topnav};
  }
  componentDidUpdate() {
    const {playable} = this.props;
    if (playable.node && this.state.topnav.length < 6) {
      let newTopnav = this.props.topnav
      newTopnav.push({
        name: 'Now Playing',
        path:`/playback${playable.node}?indexWithinChunk=${playable.indexWithinChunk}#chunk`
      })
      this.setState({topnav: newTopnav})
    }
  }
  render() {
    const {onEnter} = this.props
    let onSubmit;
    const props = omit(this.props, 'onEnter')
    if (onEnter && typeof onEnter === 'function') {
      onSubmit = value => { onEnter(value) }
    }
    return (<ComposedMenu {...props} menuItems={this.state.topnav} onEnter={onSubmit} />)
  }
}

export default connect(mapStateToProps)(MainMenuContainer)
