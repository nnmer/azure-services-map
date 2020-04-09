import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { IconIO } from './Icon';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'
import Routing, { routesUI } from 'src/helpers/routing';
import {Link} from 'react-router-dom'
import imgAzureServiceDefaultIcon from 'src/public/img/icon-azure-black-default.png'
import ServicesDirectIOModal from 'src/scenes/LandingScene/components/ServicesDirectIOModal';

const ServiceIconWithIoBadgeAndLink = props => {

  const [showIOModal, setShowIOModal] = useState(false)
  let {hidden, serviceId, className, hasIO, src, ...rest} = props
  src = src || imgAzureServiceDefaultIcon

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
            <div data-badge className="cursor-hand" >
              <a onClick={()=> setShowIOModal(true)} >
                <IconIO title="Has IO" className="io-badge"/>
              </a>
            </div>
          </OverlayTrigger>          
        : ''
      }

      {
        showIOModal
        ? <ServicesDirectIOModal
            serviceId={serviceId} 
            show={showIOModal} 
            onHide={()=>setShowIOModal(false)}
          />
        : ''
      }

      {/* <Link to={Routing.generate(routesUI.services.serviceHome, {serviceId})}> */}
        <img 
          className={`service-icon ${rest.imgClass || ''}`}
          src={src}
          {...rest}
        />
      {/* </Link> */}
    </div>
  )
}


ServiceIconWithIoBadgeAndLink.propTypes = {
  hidden: PropTypes.bool,
  src: PropTypes.any
}

export default React.memo(ServiceIconWithIoBadgeAndLink)