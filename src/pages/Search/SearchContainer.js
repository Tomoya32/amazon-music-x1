import React, { PureComponent } from 'react'
import Search from './Search'
import { addLetterToSearchTerm, removeLetterFromSearchTerm } from '../../store/modules/search'
import { loadSearchNode, clearResults } from '../../store/modules/search'
import { connect } from 'react-redux'
import { push, replace } from '../../store/modules/nav'
import { uuid } from '../../lib/utils'
import omit from 'lodash/omit'
import { updateMenu } from '../../lib/reactv-redux/MenusReducer'
import topnav from '../../components/MainMenu/topnav'

const mapDispatchToProps = {
  removeLetterFromSearchTerm,
  addLetterToSearchTerm,
  push,
  replace,
  updateMenu,
  loadSearchNode,
  clearResults,
}
const mapStateToProps = (state) => ({
  term: state.search.term,
  results: state.search.results,
  menus: state.navigation.meuns,
  pathname: state.router.location.pathname,
})

class SearchContainer extends PureComponent {
  constructor(p) {
    super(p)
    this.key = 'WHAT_IS_THIS_MAGIC?'
  }

  componentWillUpdate(nextProps) {
    if (nextProps.results !== this.props.results) {
      this.key = uuid()
    }
  }

  onSubmit(value) {
    this.props.history.push(value.path)
  }

  onLetter(letter) {
    if (letter === String.fromCharCode(parseInt(2423, 16))) {
      this.props.addLetterToSearchTerm(' ')
    } else if (letter === 'del') {
      this.props.removeLetterFromSearchTerm()
    } else {
      this.props.addLetterToSearchTerm(letter)
    }
    this.props.clearResults()
    this.props.loadSearchNode('/search/?keywords=<' + this.props.term + '>')
  }

  render() {
    return (<Search
      menuid='search'
      onFocusItem='topnav' focused
      entryFocus='search:atoz'
      onLetter={this.onLetter.bind(this)}
      {...this.props}
      contentKey={this.key}
      topnav={topnav}
    />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
