import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MainMenu, { MenuComposer } from '../../components/MainMenu'
import Space from '../../lib/reactv-redux/SpaceRedux'
import AtoZMenu from '../../components/AtoZMenu'
import { alphabet } from '../../components/AtoZMenu/AtoZContainer'
import topnav from '../../components/MainMenu/topnav'
import SearchResult from './SearchResult'
import css from './Search.scss'
import SearchIcon from '../../assets/images/icon/search-icon.js'

const Search = (props) => {
  return (
    <div className={css.Search}>

      <div className='search-info'>
        <div className='field'><SearchIcon /><label>{props.term}<span className='blinker'>|</span></label></div>
        <AtoZMenu
          menuid='search:atoz'
          mid='search:atoz'
          focused={props.isFocused('search:atoz')}
          onEnter={props.onLetter}
          onUp={props.changeFocus('topnav')}
          onDown={props.term ? props.changeFocus('home:main') : null}
          onRight={() => props.updateMenu('search:atoz', { index: 0 })}
          onLeft={() => props.updateMenu('search:atoz', { index: alphabet.length - 1 })}
        />
      </div>
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
