import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ListMenu from '../reactv-navigation/components/ListMenu'
import { updateMenuState } from './ReacTVReduxReducer'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import store from '../../store'
import { batchActions } from 'redux-batched-actions';
import smoothScroll from '../smoothScroll';

const mapStateToProps = (state, ownProps) => ({
  homehori: state.menus.homehori,
  rightmostCardIndex: state.menus[ownProps.menuid],
  menus: state.menus,
  vertScroll: state.menus.vertScroll
})

const mapDispatchToProps = {updateMenuState}

class ListMenuRedux extends Component {
  static propTypes = {
    menuid: PropTypes.string.isRequired
  }

  onChange (idx) {
    const { menuid, menus, data, homehori, rightmostCardIndex, updateMenuState } = this.props;
    let actions = [() => updateMenuState('vertScroll',false)];
    if (menuid != 'homevert') { // horizontal scroll

      // TODO Option 1: correct check for walkingLeft and uncomment code below
      // let walkingLeft = (rightmostCardIndex > homehori + 1) ? true : false; // not accurate. Need to fix.
      // let globalColumn; // save cardIndex visible at third column
      // let savedColumn; // globalColumn is element of {0,1,2}
      //
      // if (((homehori == 0 && idx > 0) || (homehori == 1 && idx > 1)) && walkingLeft) { // make only valid when going left!
      // // Don't scroll if walkingLeft
      //   savedColumn = idx + 2 - homehori;
      //   globalColumn = homehori;
      // } else {
      //   savedColumn = (idx < 2) ? 2 : idx;
      //   globalColumn = (idx > 2) ? 2 : idx;
      // }

      // TODO Option 2: use horizontal smooth scrolling
      let savedColumn = (idx < 2) ? 2 : idx; // save cardIndex visible at third column
      let globalColumn = (idx > 2) ? 2 : idx; // globalColumn is element of {0,1,2}

      if (menus[menuid] !== savedColumn) { // update card index at third column
        actions.push(() => updateMenuState(menuid, savedColumn))
      }
      if (homehori !== globalColumn) { // update state of globalColumn
        actions.push(() => updateMenuState('homehori', globalColumn))
      }
      store.dispatch(batchActions(actions)) // update multiple states in batch

    } else { // vertical scroll
      let row_desc = data[idx].summary.description;
      let row_menuid = `homemenu:${row_desc.substring(row_desc.indexOf('#'))}`;
      let savedColumn = (menus[row_menuid] === undefined || menus[row_menuid] < 2) ? 2 : menus[row_menuid];

      // compare this row's saved selection and update using global column
      store.dispatch(batchActions([updateMenuState('vertScroll',true), updateMenuState(row_menuid, savedColumn), updateMenuState(menuid, idx)]))
    }
    if (this.props.onChange) this.props.onChange(idx)
  }

  scrollElementIntoViewIfNeeded (node) {
    const { homehori } = this.props;
    // node is the element to make visible within container
    if (node) {
      const { vertScroll } = this.props;

      // scrollable container
      let container = node.parentElement.parentElement;
      if (container) {
        // to control scroll position:
        let refTop = 252.5
        // let refLeft = 50; // OPTION 1: without smoothScroll
        let refLeft = 638; // OPTION 2: with smoothScroll
        if ((node.offsetTop > refTop) || (container.scrollTop > node.offsetTop - refTop)) {
          // check if horizontal selection is within view
          container.scrollTop = node.offsetTop - refTop;
        }
        // if (((node.offsetLeft > refLeft) || (container.scrollLeft > node.offsetLeft - refLeft)) && !vertScroll) {
        if ((node.offsetLeft > refLeft) || (container.scrollLeft > node.offsetLeft - refLeft)) {
          // check if vertical selection is within view

          // OPTION 1: without smoothScroll
          // let target = node.offsetLeft - refLeft - homehori*294;
          // container.scrollLeft = target; // without smoothScroll

          // OPTION 2: with smoothScroll
          let duration = 150;
          let target = node.offsetLeft - refLeft;
          smoothScroll(container, target, duration)
        }
      }
    }
  }

  render () {
    const {onChange, rightmostCardIndex, homehori, ...rest} = this.props
    let globalColumn = (homehori === undefined) ? 0 : homehori;
    let onFocusIndex = (rightmostCardIndex === undefined || rightmostCardIndex < 2) ? globalColumn : rightmostCardIndex - 2 + globalColumn;
    return (<ListMenu onFocusIndex={onFocusIndex} scrollIntoView={this.scrollElementIntoViewIfNeeded.bind(this)} onChange={this.onChange.bind(this)} {...rest} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListMenuRedux)
