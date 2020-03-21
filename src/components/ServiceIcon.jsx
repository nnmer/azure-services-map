import React from 'react'
import PropTypes from 'prop-types'
import { IconIO } from './Icon';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'

const ServiceIcon = props => {

  let {hidden, className, hasIO, ...rest} = props

  return (
    <div hidden={hidden} className={`service-icon-wrapper ${className || ''}`} >
      {
        hasIO
        ?  <OverlayTrigger
              placement='top'
              overlay={
                <Tooltip>
                  Service has In/Out direct connections.
                </Tooltip>
              }
            >
            <div data-badge >
              <IconIO title="Has IO" className="io-badge"/>
            </div>
          </OverlayTrigger>          
        : ''
      }
      
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