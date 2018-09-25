import React, { Component } from 'react'
import PropTypes from 'prop-types'
import VerticalTextMenu from '../../components/VerticalTextMenu'
import MainMenu from '../../components/MainMenu'
// import ExploreMenu from '../../components/ExploreMenu'
import AtoZMenu from '../../components/AtoZMenu'
import {alphabet} from '../../components/AtoZMenu/AtoZContainer'
import topnav from '../../components/MainMenu/topnav'
import './Search.css'

const Search = ({changeFocus, isFocused, term, results, onLetter, onSubmit, updateMenu}) => {
  // what happens to topnav.length?
  // debugger
    return (
      <div className="Home-content">
        <MainMenu className='main-menu' menuid='topnav' mid='topnav' focused={isFocused('topnav')} onEnter={onSubmit}
          onDown={changeFocus('search:atoz')} onRight={() => updateMenu('topnav', {index: 0})} onLeft={() => updateMenu('topnav', {index: topnav.length - 1 })}/>
        <div className='bottom'>
          <div className='menu'>
            <AtoZMenu className='search-content' menuid='search:atoz' mid='search:atoz' focused={isFocused('search:atoz')} onEnter={onLetter}
              onUp={changeFocus('topnav')} onRight={() => updateMenu('search:atoz', {index: 0})} onLeft={() => updateMenu('search:atoz', {index: alphabet.length - 1 })} />
            <div className='search-content field'>{term}<span className='blinker'>|</span></div>
          </div>
        </div>
      </div>
    )
}

export default Search
