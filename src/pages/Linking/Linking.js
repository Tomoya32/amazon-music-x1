import React from 'react'
import './Linking.css'

const Linking = ({user_code, verification_uri}) => (
  <div className="Linking">
    <h1>Linking</h1>
    <h2>Log in with: {user_code}</h2>
    {verification_uri &&
    <a href={verification_uri} target="_blank">{verification_uri}</a>
    }
  </div>
)
export default Linking
