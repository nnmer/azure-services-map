import React, { useState, useRef } from 'react'
import IconHamburger from 'src/icons/hamburger.svg'
import PropTypes from 'prop-types'
import ServiceLinking from 'src/services/ServiceLinking';
import Overlay from 'react-bootstrap/Overlay';

const PeriodicTableServiceMenu = props => {

  const target = useRef(null);
  const [show, setShow] = useState(false);

  let {serviceId, ...rest} = props
  let service = ServiceLinking.servicesUnfiltered[serviceId]

  return (
    <>
      <a href="#"  className="action-icon" ref={target} onClick={() => setShow(!show)} >
        <IconHamburger width="16px" />
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
              <a className="dropdown-item" href={service.url} target="_blank">Service doc</a>
              {
                ((service.servicesIO.input && service.servicesIO.input.length > 0)
                  || (service.servicesIO.output && service.servicesIO.output.length > 0) 
                )
                ? <a className="dropdown-item" href="#" onClick={()=>rest.onSelect(service.id, 'io-modal')}>
                    Direct I/O services
                    </a>
                : ''
              }
              {
                (service.servicesIO.output && service.servicesIO.output.length > 0)
                ? <a className="dropdown-item" href="#" onClick={()=>rest.onSelect(service.id, 'io-modal-graph')}>
                    IO graph
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