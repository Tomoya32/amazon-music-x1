import React, { Component } from 'react'
import PropTypes from 'prop-types'
import VerticalTextMenu from '../../components/VerticalTextMenu'
import MainMenu, { MenuComposer } from '../../components/MainMenu'
import Space from '../../lib/reactv-redux/SpaceRedux'
import AtoZMenu from '../../components/AtoZMenu'
import {alphabet} from '../../components/AtoZMenu/AtoZContainer'
import topnav from '../../components/MainMenu/topnav'
import './Search.css'

const Search = ({changeFocus, isFocused, term, results, onLetter, updateMenu}) => {
    return (
      <div className="Home-content">
        <AtoZMenu className='search-content' menuid='search:atoz' mid='search:atoz' focused={isFocused('search:atoz')} onEnter={onLetter}
          onUp={changeFocus('topnav')} onRight={() => updateMenu('search:atoz', {index: 0})} onLeft={() => updateMenu('search:atoz', {index: alphabet.length - 1 })} />
        <div className='search-content field'>{term}<span className='blinker'>|</span></div>
      </div>
    )
}

export default Space(MenuComposer(MainMenu,Search))
