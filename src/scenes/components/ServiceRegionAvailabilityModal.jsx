import React, {useState} from 'react'
import PropTypes from 'prop-types'
import imgGlobe from 'src/public/img/icon_globe.svg'
import Modal from 'react-bootstrap/Modal'
import ServiceLinking from 'src/services/ServiceLinking';

const ModalComponent = props => {

  const {service, ...rest} = props

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

  const filteredServiceAvailability = ServiceLinking.filterServiceAvailabilityByRegionFilter(service.availability)

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
              Object.keys(filteredServiceAvailability).map( (key, idx) => {
                return (
                  <tr key={idx} className="table">
                    <th>
                      {ServiceLinking.regionsDic[key]}
                      <br/>
                      <span className="text-muted">
                        {key}
                      </span>
                    </th>
                    <td>
                      <span className={`region-availability ${computeAvailabilityClass(service.availability[key])}`}>
                      
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
          </tbody>
          <tfoot></tfoot>
        </table>
      </Modal.Body>
      
    </Modal>
  );
}
 
const ServiceRegionAvailabilityModal = props => {

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <a 
        href="#"
        className="action-icon"
        hidden={props.hidden}
        onClick={()=>setModalOpen(true)}
      >
        <img src={imgGlobe} width="16px"/>
      </a>
      <ModalComponent 
        show={modalOpen} 
        onHide={() => setModalOpen(false)}
        service={props.service}
        dialogClassName="modal-service-availability-list"
        size="lg"
      />
    </>
  )
}

ServiceRegionAvailabilityModal.propTypes = {
  hidden: PropTypes.bool.isRequired,
  service: PropTypes.object.isRequired
}

export default ServiceRegionAvailabilityModal