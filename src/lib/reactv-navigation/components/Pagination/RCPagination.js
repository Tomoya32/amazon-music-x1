import 'rc-pagination/assets/index.css';
import Pagination from 'rc-pagination';
import React from 'react';

const itemRender = (current, type, element) => {
  if (type === 'page') {
    return <a href={`#${current}`}>{current}</a>;
  }
  return element;
};

class RCPagination extends React.Component {

  render() {
    return (
      <div>
        <Pagination total={100} itemRender={itemRender} />
      </div>
    );
  }
}

export default RCPagination
