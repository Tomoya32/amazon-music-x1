import React, { Component } from 'react'
import RowMenuComposer from '../../lib/reactv-navigation/components/RowMenu/RowMenuComposer'
import AtoZMenu from './AtoZMenu'
import omit from 'lodash/omit'
import without from 'lodash/without'

import debugWrapper from 'debug'
import config from '../../lib/config'

const debug = debugWrapper('app:atoz_menu')

const ComposedMenu = RowMenuComposer(AtoZMenu)

export const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').map(l => l.toUpperCase())
alphabet.push(String.fromCharCode(parseInt(2423, 16)))
alphabet.push('del')

class AtoZContainer extends Component {
  constructor (p) {
    super(p)
    this.state = {
      clicked: []
    }
  }

  setClicked (value) {
    const {onEnter} = this.props
    const clicked = this.state.clicked.slice(0)
    clicked.push(value)
    debug('setting state clicked ', clicked)
    this.setState({clicked})
    setTimeout(() => {
      const clicked = without(this.state.clicked, value)
      debug('setting state clicked ', clicked)
      this.setState({clicked})
      onEnter(value)
    }, config.blinkDelay)
  }

  render () {
    const {onEnter} = this.props
    let onLetter = value => console.info('Value: ' + value)
    const props = omit(this.props, 'onEnter')
    if (onEnter && typeof onEnter === 'function') {
      onLetter = value => {
        this.setClicked(value)
        // debug('VALUE: ' + value)
        // onEnter(value)
      }
    }
    return (<ComposedMenu {...props} menuItems={alphabet} onEnter={onLetter} clicked={this.state.clicked} />)
  }
}

export default AtoZContainer
