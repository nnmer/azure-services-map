import React, {useState} from 'react'
import imgHamburger from 'src/public/img/icon_hamburger.svg'
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types'
import ServicesDirectIOModal from './ServicesDirectIOModal'

const PeriodicTableServiceMenu = props => {

  let [eventKey, setSelectedKey] = useState(null)

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

  

  let {service, ...rest} = props

  return (
    <Dropdown 
      onSelect={(eventKey)=>{
        setSelectedKey(eventKey)
      }}
      
    >
      <Dropdown.Toggle as={CustomToggle}> </Dropdown.Toggle>

      <Dropdown.Menu className="primary">
        <Dropdown.Item href={service.url} target="_blank">
          Docs
        </Dropdown.Item>

        {
          ((service.servicesIO.input && service.servicesIO.input.length > 0)
            || (service.servicesIO.output && service.servicesIO.output.length > 0) 
          )
          ? <Dropdown.Item as="button" eventKey="io-modal">
              Show Direct In/Out connections
            </Dropdown.Item>
          : ''
        }
        
        {
          (service.servicesIO.output && service.servicesIO.output.length > 0)
          ? <Dropdown.Item as="button" eventKey="io-directed-graph">
                {/* @click="$root.$emit('app::services::io-directed-graph-modal::show', $event, service.id)" */}
              Show IO tree
            </Dropdown.Item>
          : ''
        }        
      </Dropdown.Menu>

      <ServicesDirectIOModal 
        serviceId={service.id} 
        show={eventKey && eventKey=='io-modal'}
        onHide={()=>setSelectedKey(null)}
      />
    </Dropdown>
  )
}

PeriodicTableServiceMenu.propTypes = {
  service: PropTypes.object.isRequired
}

export default PeriodicTableServiceMenu