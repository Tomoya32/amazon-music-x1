import React from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import PropTypes from 'prop-types'
import './ListMenu.css'

class Renderer extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    focused: PropTypes.bool,
    item: PropTypes.object
  }
  static defaultProps = {
    focused: false
  }
  render () {
    const {item, focused, render} = this.props
    return render({item, focused})
  }
}

const ListMenu = ({data = [], scrollIntoView, renderItem, className, index, focused, horizontal}) => {
  // const listItem = React.createRef();

  return (
    <div className={cx('ListMenu', className, {horizontal})}>
      {data.map( (item,currentIndex) => {
        let active = (focused && currentIndex === index);
        let props = {
          key: currentIndex,
          item: item,
          focused: active,
          render: renderItem,
          scrollIntoView: scrollIntoView
        };
        // if (active) { props.ref = listItem; }
        return <Renderer {...props} />
      })}
    </div>
  )
}
/*
    <ListMenu data={data} renderItem={ListCard} horizontal focused menuid='single-list-menu' />
 */
ListMenu.propTypes = {
  data: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  currentIndex: PropTypes.number,
  focused: PropTypes.bool,
  horizontal: PropTypes.bool
}

export default ListMenu
