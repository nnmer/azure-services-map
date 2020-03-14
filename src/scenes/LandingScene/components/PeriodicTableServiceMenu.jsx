import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import ServiceLinking from 'src/services/ServiceLinking';
import Overlay from 'react-bootstrap/Overlay';
import { IconHamburger, IconIO, IconGraphRight, IconBook } from 'src/components/Icon';

const PeriodicTableServiceMenu = props => {

  const target = useRef(null);
  const [show, setShow] = useState(false);

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
          rootClose={true}
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
                ? <a className="dropdown-item" href="#" onClick={()=>rest.onSelect(service.id, 'io-modal')}>
                    <IconIO/> Direct I/O services
                  </a>
                : ''
              }
              {
                (service.servicesIO.output && service.servicesIO.output.length > 0)
                ? <a className="dropdown-item" href="#" onClick={()=>rest.onSelect(service.id, 'io-modal-graph')}>
                    <IconGraphRight/> IO graph
                  </a>
                : ''
              } 
            </div>
          )}
        </Overlay>
        : ''
      }
    </>
  )
}

PeriodicTableServiceMenu.propTypes = {
  serviceId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default React.memo(PeriodicTableServiceMenu)