import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import ServiceLinking from 'src/services/ServiceLinking';
import Overlay from 'react-bootstrap/Overlay';
import { IconHamburger, IconBook, IconIO, IconGraphRight } from 'src/components/Icon';
import ServicesDirectIOModal from './ServicesDirectIOModal';
import ServicesDirectIOInteractiveGraphModal from './ServicesDirectIOInteractiveGraphModal';

const PeriodicTableServiceMenu = props => {

  const target = useRef(null);
  const [show, setShow] = useState(false);
  const [showIOModal, setShowIOModal] = useState(false);
  const [showGraphModal , setShowGraphModal ] = useState(false);

  let {serviceId, ...rest} = props
  let service = ServiceLinking.servicesUnfiltered[serviceId]

  return (
    <>
      <a href="#"  className="action-icon" ref={target} onClick={() => setShow(!show)} >
        <IconHamburger/>
      </a>
      {
        show
        ? <Overlay target={target.current} show={show} placement="right" 
          rootClose={!(showIOModal || showGraphModal)}
          onHide={()=>setShow(!show)}
          >
          {({
            placement,
            scheduleUpdate,
            arrowProps,
            outOfBoundaries,
            show: _show,
            ...props
          }) => (
            <div  {...props}  className="dropdown-menu" >
              <a className="dropdown-item" href={service.url} target="_blank">
                <IconBook /> Service doc  <small>&#x2924;</small>
              </a>
              {
                ((service.servicesIO.input && service.servicesIO.input.length > 0)
                  || (service.servicesIO.output && service.servicesIO.output.length > 0) 
                )
                ? <a href="#" 
                    className="dropdown-item" 
                    onClick={()=> setShowIOModal(true)}
                  >
                    <IconIO /> Direct I/O services        
                  </a>
                : ''
              }
              {
                (service.servicesIO.output && service.servicesIO.output.length > 0)
                ? <a href="#" 
                    className="dropdown-item" 
                    onClick={()=> setShowGraphModal(true)}
                  >
                    <IconGraphRight /> IO graph
                  </a>
                : ''
              } 
            </div>
          )}
        </Overlay>
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
      {
        showGraphModal
        ? <ServicesDirectIOInteractiveGraphModal 
            serviceId={serviceId}
            show={showGraphModal} 
            onHide={()=>setShowGraphModal(false)}
          />
        : ''
      }
    </>
  )
}

PeriodicTableServiceMenu.propTypes = {
  serviceId: PropTypes.string.isRequired
}

export default React.memo(PeriodicTableServiceMenu)