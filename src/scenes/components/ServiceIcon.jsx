import React from 'react'
import PropTypes from 'prop-types'

const ServiceIcon = props => {

  let {hidden, containerClass, ...rest} = props

  return (
    <div hidden={hidden} className={`service-icon-wrapper  text-center ${containerClass || ''}`}>
      <img 
        className={`service-icon ${rest.className || ''}`}
        {...rest}
      />
    </div>
  )
}


ServiceIcon.propTypes = {
  hidden: PropTypes.bool,
  containerClass: PropTypes.any,
  src: PropTypes.any.isRequired
}

export default ServiceIcon