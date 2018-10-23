import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MainMenu, { MenuComposer } from '../../components/MainMenu'
import Space from '../../lib/reactv-redux/SpaceRedux'
import AtoZMenu from '../../components/AtoZMenu'
import { alphabet } from '../../components/AtoZMenu/AtoZContainer'
import topnav from '../../components/MainMenu/topnav'
import SearchResult from './SearchResult'
import './Search.css'
// { changeFocus, isFocused, term, results, onLetter, updateMenu, ...props }
const Search = (props) => {
  return (
    <div className="Home-content">
      <AtoZMenu
        className='search-content'
        menuid='search:atoz'
        // mid='search:atoz'
        focused={props.isFocused('search:atoz')}
        onEnter={props.onLetter}
        onUp={props.changeFocus('topnav')}
        onDown={props.changeFocus('home:main')}
        onRight={() => props.updateMenu('search:atoz', { index: 0 })}
        onLeft={() => props.updateMenu('search:atoz', { index: alphabet.length - 1 })}
      />
      <div className='search-content field'>{props.term}<span className='blinker'>|</span></div>
    
      <SearchResult
        menuid='result'
        onFocusItem='home:main'
        {...props}
        focused={props.isFocused('home:main')}
      />
    </div>
  )
}

export default Space(MenuComposer(MainMenu, Search))