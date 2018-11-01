import React from 'react'

const PauseButton = ({fill}) => <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="38" height="42" viewBox="0 0 38 42"><defs><path id="554xa" d="M621 580a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z"/><path id="554xb" d="M643 580a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z"/></defs><g><g opacity=".95" transform="translate(-621 -576)"><g opacity=".85"><use fill={fill ? fill : "#b1bcc5"} xlinkHref="#554xa"/></g><g opacity=".85"><use fill={fill ? fill : "#b1bcc5"} xlinkHref="#554xb"/></g></g></g></svg>

export default PauseButton
