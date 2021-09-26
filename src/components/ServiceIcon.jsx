import React from 'react'
import PropTypes from 'prop-types'
import imgAzureServiceDefaultIcon from 'src/styles/img/icon-azure-black-default.png'

const ServiceIcon = props => {

  let {hidden, className, src, ...rest} = props
  src = src || imgAzureServiceDefaultIcon

  return (
    <div hidden={hidden} className={`service-icon-wrapper ${className || ''}`} >
      <img
        className={`service-icon ${rest.imgClass || ''}`}
        src={src}
        {...rest}
      />
    </div>
  )
}


ServiceIcon.propTypes = {
  hidden: PropTypes.bool,
  src: PropTypes.any
}

export default React.memo(ServiceIcon)