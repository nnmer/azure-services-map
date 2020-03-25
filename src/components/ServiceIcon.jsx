import React from 'react'
import PropTypes from 'prop-types'

const ServiceIcon = props => {

  let {hidden, className, ...rest} = props

  return (
    <div hidden={hidden} className={`service-icon-wrapper ${className || ''}`} >
      <img 
        className={`service-icon ${rest.imgClass || ''}`}
        {...rest}
      />
    </div>
  )
}


ServiceIcon.propTypes = {
  hidden: PropTypes.bool,
  src: PropTypes.any.isRequired
}

export default React.memo(ServiceIcon)