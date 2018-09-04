import React, { Component } from 'react'
import ListMenu from '../reactv-navigation/components/ListMenu'
import { updateMenuState } from './ReacTVReduxReducer'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const mapStateToProps = (state, ownProps) => ({
  currentIndex: state.menus[ownProps.menuid]
})

const mapDispatchToProps = {updateMenuState}

class ListMenuRedux extends Component {
  static propTypes = {
    menuid: PropTypes.string.isRequired
  }

  onChange (idx) {
    console.info('on change', this.props.menuid, idx)
    this.props.updateMenuState(this.props.menuid, idx)
    if (this.props.onChange) this.props.onChange(idx)
  }

  render () {
    const {onChange, ...rest} = this.props
    return (<ListMenu onFocusIndex={this.props.currentIndex}
      onChange={this.onChange.bind(this)} {...rest} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListMenuRedux)