import React, { Component } from 'react'
import MainMenu from './MainMenu'
import { connect } from 'react-redux'
import omit from 'lodash/omit'
import RowMenuComposer from '../../lib/reactv-navigation/components/RowMenu/RowMenuComposer'
import { replace } from '../../store/modules/nav'
import { mergeChunkWithPathAndQuery } from '../../lib/utils'

const ComposedMenu = RowMenuComposer(MainMenu)
const mapStateToProps = ({router, playable}) => ({pathname: router.location.pathname, playable})
const mapDispatchToProps = {replace}

class MainMenuContainer extends Component {
  constructor(props){
    super(props)
    this.state = {topnav: props.topnav};
  }
  componentDidUpdate() {
    const {playable} = this.props;
    if (playable.node && this.state.topnav.length == 5) this.updateCurrentPlayable();
  }
  updateCurrentPlayable() {
    const {topnav, playable} = this.props;
    const newTopnav = topnav.slice(0);
    const dest = mergeChunkWithPathAndQuery(['/playback', playable.node], playable.chunk, {indexWithinChunk: playable.indexWithinChunk} )
    newTopnav.push({ name: 'Now Playing', path: dest })
    this.setState({topnav: newTopnav})
  }
  handleSelection(dest) {
    const {onEnter, replace} = this.props
    replace(dest.path)
    if (onEnter && typeof onEnter === 'function') onEnter(dest)
  }
  render() {
    const props = omit(this.props, ['onEnter', 'updateMenu'])
    return (<ComposedMenu {...props} menuItems={this.state.topnav} onEnter={this.handleSelection.bind(this)} onLeft={() => this.props.updateMenu('topnav', {index: this.state.topnav.length - 1 })}/>)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MainMenuContainer)
