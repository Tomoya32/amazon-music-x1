import React from 'react';
import Loader from 'react-loaders';
import './PageLoading.scss';
import cx from 'classnames'

const PageLoading = ({className}) => (
  <div className={cx("page-loading",className)}>
    <Loader type="line-scale-pulse-out-rapid" active />
  </div>
);

export default PageLoading;
