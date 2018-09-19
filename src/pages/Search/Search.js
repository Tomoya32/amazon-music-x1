import React, { Component } from 'react'
import PropTypes from 'prop-types'
import VerticalTextMenu from '../../components/VerticalTextMenu'
// import ExploreMenu from '../../components/ExploreMenu'
import AtoZMenu from '../../components/AtoZMenu'
import {alphabet} from '../../components/AtoZMenu/AtoZContainer'
import './Search.css'

const Search = ({changeFocus, isFocused, term, results, onLetter, updateMenu, topNav}) => {
    return (
      <div className="Home-content">
        <VerticalTextMenu items={topNav} menuid={`home:topnav`} focused={isFocused('home:topnav')} onDown={changeFocus('search:atoz')} />
        <div className='bottom'>
          <div className='menu'>
            <AtoZMenu className='search-content' menuid='search:atoz' mid='search:atoz' focused={isFocused('search:atoz')} onEnter={onLetter}
              onDown={() => { // show results if they are available
              // if (results.length) {
              //   changeFocus('search:results')() // changeFocus returns a function...
              // }
            }} onUp={changeFocus('home:topnav')} onRight={() => updateMenu('search:atoz', {index: 0})} onLeft={() => updateMenu('search:atoz', {index: alphabet.length - 1 })} />
            <div className='search-content field'>{term}<span className='blinker'>|</span></div>
          </div>
        </div>
      </div>
    )
}

export default Search
