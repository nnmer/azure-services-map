import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-bootstrap/Modal'
import ServiceLinking from 'src/services/ServiceLinking';

const ServiceRegionAvailabilityModal = props => {

  let [service, setService] = useState(null)

  useEffect( () => {
    onSelectService(props.serviceId)
  }, [props.serviceId])

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

  const {serviceId, ...rest} = props

  const computeAvailabilityClass = av => {
    if (av.inGA) {
      return 'region-availability-ga'
    } else if (av.inPreview) {
      return 'region-availability-preview'
    } else if (av.expectation) {
      return 'region-availability-expected'
    }
    return ''
  }

  const filteredServiceAvailability = ServiceLinking.filterServiceAvailabilityByRegionFilter(service.availability, true)

  return (
    <Modal {...rest} scrollable>
      <Modal.Header closeButton>
        <Modal.Title >
          {service ? `${service.name} available at:` : ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-scroll-always">
        <table className="table table-hover">
          <thead></thead>
          <tbody>
          {
            Object.keys(filteredServiceAvailability).map( (geo, geoIdx) => {
              return (
                <React.Fragment key={`${geo}`}>
                  <tr key={`${geo}-${geoIdx}`}>
                    <th colSpan="2">
                      <h5>{geo}</h5>
                    </th>
                  </tr>
                  {
                    Object.keys(filteredServiceAvailability[geo]).map( (key, idx) => {
                      return (
                        <tr key={idx} className="table">
                          <th style={{paddingLeft: "100px"}}>
                            {ServiceLinking.regionsDic[key]}
                            <br/>
                            <span className="text-muted">
                              {key}
                            </span>
                          </th>
                          <td>
                            <span className={`region-availability-round-flag ${computeAvailabilityClass(service.availability[key])}`}>
                            
                            </span>
                            <span className="ml-2">
                              {service.availability[key].inGA ? 'GA' : ''}
                              {service.availability[key].inPreview ? 'Preview' : ''}
                              {service.availability[key].expectation ? service.availability[key].expectation : ''}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  }
                </React.Fragment>
              )
            })
          }
          </tbody>
          <tfoot></tfoot>
        </table>
      </Modal.Body>
      
    </Modal>
  );
}

ServiceRegionAvailabilityModal.propTypes = {
  serviceId: PropTypes.string.isRequired
}

export default ServiceRegionAvailabilityModal