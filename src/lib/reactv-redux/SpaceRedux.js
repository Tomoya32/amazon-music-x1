import React, { Component } from 'react'
import Space from '../reactv-navigation/components/Space/Space'
import { updateMenuState } from './ReacTVReduxReducer'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


 const SpaceReduxComposer = (Inner) => {
  const mapStateToProps = (state, ownProps) => ({
    currentFocus: state.menus[ownProps.menuid]
  })
  const mapDispatchToProps = {updateMenuState}
  const InnerComponent = Space(Inner)

   class SpaceRedux extends Component {
    static propTypes = {
      menuid: PropTypes.string.isRequired
    }

    onChange (focus) {
      console.info('on change', this.props.menuid, focus)
      this.props.updateMenuState(this.props.menuid, focus)
      if (this.props.onChange) this.props.onChange(focus)
    }

    render () {
      const {onChange, onFocusItem, ...rest} = this.props
      return (<InnerComponent onFocusItem={this.props.currentFocus ? this.props.currentFocus : this.props.onFocusItem }
        onChange={this.onChange.bind(this)} {...rest} />)
    }
  }
  return connect(mapStateToProps, mapDispatchToProps)(SpaceRedux)
}


export default SpaceReduxComposer