import React from 'react';
import Loader from 'react-loaders';
import './PageLoading.scss';

const PageLoading = () => (
  <div className="page-loading">
    <Loader type="line-scale-pulse-out-rapid" active />
  </div>
);

export default PageLoading;
