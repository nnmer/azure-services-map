import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-bootstrap/Modal'
import imgArrowDown from 'src/public/img/arrow-down.png'
import ListServiceDirectIOEntries from './ListServiceDirectIOEntries';
import ServiceLinking from 'src/services/ServiceLinking';
import { IconIO } from 'src/components/Icon';
import TelemetryService from 'src/services/TelemetryService';

const ServicesDirectIOModal = props => {
 
  let [service, setService] = useState(null)

  useEffect( () => {
    onSelectService(props.serviceId)
  }, [props.serviceId])

  let {serviceId, ...rest} = props

  const onSelectService = serviceId => {
    let exist = ServiceLinking.findServiceById(serviceId)
    if (exist) {
      setService(exist)
    } else {
      console.error(`The service was not found`)
    }
  }

  if (null === service) {
    return ''
  }

  TelemetryService.trackPageView('ServicesDirectIOModal', {serviceId: service.id})

  return (
    <>

       <Modal scrollable
        show={props.show}
        size="xl"
        {...rest}
      >
        <Modal.Header closeButton>
          <Modal.Title >
            <IconIO/> 
            Direct IOs
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-scroll-always p-0">
          <div className="container services-direct-io-list p-0">
            <div className="row no-gutters">
              <div className="col" hidden={!(service.servicesIO.input && service.servicesIO.input.length > 0)}>
                <div className="list-group">
                  <div className="list-group-item bg-primary listIOtitle text-center text-bold">
                    <h5>To: {service.name}</h5>
                    <img src={imgArrowDown} width="35px" style={{transform: "rotate(180deg)"}}/>
                  </div>

                  <ListServiceDirectIOEntries
                    onSelectService={onSelectService}
                    dataSource={service.servicesIO.input || []}
                  />

                  </div>
              </div>



              <div className="col" hidden={!(service.servicesIO.output && service.servicesIO.output.length > 0)}>
                <div className="list-group">
                  <div className="list-group-item bg-success listIOtitle text-center">
                    <h5>From: {service.name}</h5>
                    <img src={imgArrowDown} width="35px"/>
                  </div>

                  <ListServiceDirectIOEntries
                    onSelectService={onSelectService}
                    dataSource={service.servicesIO.output || []}
                  />

                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

ServicesDirectIOModal.propTypes = {
  serviceId: PropTypes.string.isRequired
}

export default ServicesDirectIOModal;