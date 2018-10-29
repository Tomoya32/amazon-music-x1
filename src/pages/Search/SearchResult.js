import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import '../../components/HomeMenuHorizontalLoadingMenu/HomeMenuHorizontalLoadingMenu.css'
import PropTypes from 'prop-types'
import Space from '../../lib/reactv-redux/SpaceRedux'
import {
  getMenuIDsSelector,
  getKeySelector,
  getItemDescriptionsSelectors,
  getPlayableSelector,
  getNavigationNodeSummariesSelector,
  getCatalogData,
} from '../../lib/selectors/searchNode_selectors'
import { handleItemSelection } from '../../lib/utils'
import HomeMenuHorizontalLoadingMenu from '../../components/HomeMenuHorizontalLoadingMenu/HomeMenuHorizontalLoadingMenu.js'
import {replace} from '../../store/modules/nav'
import PageLoading from '../../components/PageLoading';

const mapStateToProps = (state, props) => ({
  allMenuIDs: getMenuIDsSelector(state),
  catalog: getCatalogData(state),
  location: state.router.location,
  pathKey: getKeySelector(state),
  term: state.search.term,
  itemDescriptions: getItemDescriptionsSelectors(state),
  playables: getPlayableSelector(state),
  navigationNodeSummaries: getNavigationNodeSummariesSelector(state),
  pathname: state.router.location.pathname,
})

const mapDispatchToProps = {
  replace,
}

class SearchResult extends Component {
  constructor (props) {
    super(props)
    this.handleSelection = dest => {
      const {replace} = this.props
      const key = this.props.pathname.replace(/^\/(search)\/*/, '/')
      if(dest.type === 'SEE_MORE') replace(`/list/?keyword=<${this.props.term}>`)
      else handleItemSelection.call(this, dest, key)
    }
  }

  static propTypes = {
    itemDescription: PropTypes.object.isRequired
  }

  render() {
    const { focused, isFocused, changeFocus } = this.props;
    if (this.props.catalog) {
      return (
        
          <HomeMenuHorizontalLoadingMenu
            {...this.props.catalog}
            onClick={this.handleSelection.bind(this)}
            menuid={'home:main'}
            focused={isFocused('home:main')}
            onFocusItem={'home:main'}
            onUp={changeFocus('search:atoz')}
            name={"#search"}
            allMenuIDs={this.props.allMenuIDs}
          />

      )
    } else {
      return (
        <PageLoading />
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space(SearchResult))
