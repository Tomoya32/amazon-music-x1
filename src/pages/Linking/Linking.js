import React from 'react'
import './Linking.css'

const Linking = ({user_code, verification_uri}) => (
  <div className="Linking">
    <h1>Linking</h1>
    <h2>Log in with: {user_code}</h2>
    {verification_uri &&
    <a href={verification_uri} target="_blank">{verification_uri}</a>
    }
    <p>Client ID: {process.env.REACT_APP_AMAZON_MUSIC_CLIENT_ID}</p>
    <p>Serial Number: {process.env.REACT_APP_SERIAL_NUMBER}</p>
    <p>Test string: {process.env.REACT_APP_TEST_STRING}</p>
    <p>Explicit variable value: {process.env.REACT_APP_EXPLICIT_VALUE}</p>
    <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
  </div>
)
export default Linking
