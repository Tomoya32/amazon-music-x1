import React from 'react'
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

const ListMenu = ({data = [], renderItem, className, index, focused, horizontal}) => (
  <div className={cx('ListMenu', className, {horizontal})}>
    {data.map((item, currentIndex) => {
      return <Renderer key={currentIndex} item={item} focused={ focused && currentIndex === index} render={renderItem}/>
    })}
  </div>
)
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