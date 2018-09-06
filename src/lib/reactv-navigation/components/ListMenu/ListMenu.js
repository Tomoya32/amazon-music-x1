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

class ListMenu extends React.Component {
  constructor(props) {
    super(props);
    this.listItem = React.createRef();
  }
  render() {
    const { data, renderItem, className, index, focused, horizontal } = this.props;
    return (
      <div className={cx('ListMenu', className, {horizontal})}>
        {data.map( (item,currentIndex) => {
          let active = (focused && currentIndex === index);
          let props = {
            key: currentIndex,
            item: item,
            focused: active,
            render: renderItem
          };
          if (active) { props.ref = this.listItem; }
          return <Renderer {...props} />
        })}
      </div>
    )
  }

  componentDidMount() {
    this.scrollElementIntoViewIfNeeded();
  }

  componentDidUpdate() {
    this.scrollElementIntoViewIfNeeded();
  }

  scrollElementIntoViewIfNeeded() {
    let node = ReactDOM.findDOMNode(this.listItem.current);
    if (node) {
      // TODO: configure position of element
      // see Web API: https://developer.mozilla.org/en-US/docs/Web/API/Element
      node.scrollIntoView();
      // TODO: fix width of element before enabling smooth scrolling below
      // itemComponent.scrollIntoView({ behavior: 'smooth' });
    }
  }
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
