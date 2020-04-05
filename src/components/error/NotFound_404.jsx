import React from 'react'
import PropTypes from 'prop-types'

const NotFound_404 = props => {
  return (
    <div className="text-center">
      <h3>{props.errorMessage || 'Not found'}</h3>
      {
        props.errorSubMessage
        ? <p>{props.errorSubMessage}</p>
        : ''
      }
    </div>
  )
}
NotFound_404.propTypes = {
  errorMessage: PropTypes.string,
  errorSubMessage: PropTypes.string
}


export default NotFound_404