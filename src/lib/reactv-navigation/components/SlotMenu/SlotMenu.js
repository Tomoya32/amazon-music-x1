import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import './SlotMenu.css'

class SlotMenuItemRenderer extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    focused: PropTypes.bool.isRequired,
    item: PropTypes.object
  }
  render () {
    const {item, focused, render} = this.props
    return render({item, focused})
  }
}

const SlotMenu = ({data, renderItem, className, index, focused, horizontal, style, passRef}) => (
  <div className={cx('SlotMenu', className, {horizontal})} style={style}  ref={passRef}>
    {data.map((item, currentIndex) => {
      return <SlotMenuItemRenderer key={currentIndex} item={item} focused={ focused && currentIndex === index} render={renderItem} />
    })}
  </div>
)
/*
    <SlotMenu data={data} renderItem={ListCard} horizontal focused menuid='single-list-menu' />
 */
SlotMenu.propTypes = {
  data: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  currentIndex: PropTypes.number,
  focused: PropTypes.bool,
  horizontal: PropTypes.bool
}

export default SlotMenu