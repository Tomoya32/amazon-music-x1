import React, { Component } from 'react'
import Linking from './Linking'
import { connect } from 'react-redux'
import { getCode } from '../../store/modules/linking'

const mapStateToProps = ({linking: {user_code, verification_uri}}) => (
  {
    user_code, verification_uri
  }
)

const mapDispatchToProps = {getCode}
class LinkingContainer extends Component {
  componentDidMount () {
    this.props.getCode()
  }

  render () {
    const {verification_uri, user_code} = this.props
    return (
      <Linking user_code={user_code} verification_uri={verification_uri} />
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LinkingContainer)