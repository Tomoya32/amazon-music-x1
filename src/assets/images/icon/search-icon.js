import React from 'react'

const SearchButton = ({fill}) => <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 30 30"><defs><path id="m7q3a" d="M107.631 184.603l-.335.336a12.353 12.353 0 0 0 2.548-7.516c0-6.86-5.561-12.423-12.423-12.423C90.561 165 85 170.563 85 177.423s5.561 12.423 12.421 12.423a12.36 12.36 0 0 0 7.518-2.549l-.338.336 6.59 6.588 3.03-3.03zm-10.21.957c-4.487 0-8.135-3.651-8.135-8.137 0-4.487 3.648-8.137 8.135-8.137 4.488 0 8.138 3.65 8.138 8.137 0 4.486-3.65 8.137-8.138 8.137z"/></defs><g><g opacity="1" transform="translate(-85 -165)"><use fill={fill ? fill : "#fff"} xlinkHref="#m7q3a"/></g></g></svg>

export default SearchButton
