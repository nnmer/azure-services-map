import React from 'react'
import imgHamburger from 'src/public/img/icon_hamburger.svg'
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types'
import ServiceLinking from 'src/services/ServiceLinking';

const PeriodicTableServiceMenu = props => {

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      className="action-icon"
      href="#"
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <img src={imgHamburger} width="16px"/>
    </a>
  ));

  let {serviceId, ...rest} = props
  let service = ServiceLinking.servicesUnfiltered[serviceId]

  return (
    <Dropdown 
      id={`menu-dropdown-service-${service.id}`}
      onSelect={(eventKey)=>{
        props.onSelect(service.id, eventKey)
      }}      
    >
      <Dropdown.Toggle as={CustomToggle} id={`menu-toggle-service-${service.id}`}> </Dropdown.Toggle>

      <Dropdown.Menu className="primary">
        <Dropdown.Item href={service.url} target="_blank" eventKey="doc-url">
          Service doc
        </Dropdown.Item>

        {
          ((service.servicesIO.input && service.servicesIO.input.length > 0)
            || (service.servicesIO.output && service.servicesIO.output.length > 0) 
          )
          ? <Dropdown.Item as="button" eventKey="io-modal">
              Direct I/O services
            </Dropdown.Item>
          : ''
        }
        
        {
          (service.servicesIO.output && service.servicesIO.output.length > 0)
          ? <Dropdown.Item as="button" eventKey="io-directed-graph">
              IO graph
            </Dropdown.Item>
          : ''
        }        
      </Dropdown.Menu>
    </Dropdown>
  )
}

PeriodicTableServiceMenu.propTypes = {
  serviceId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default React.memo(PeriodicTableServiceMenu)