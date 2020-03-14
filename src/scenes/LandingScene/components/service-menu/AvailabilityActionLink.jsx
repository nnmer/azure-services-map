import React from 'react'
import ServiceRegionAvailabilityModal from '../ServiceRegionAvailabilityModal';
import { IconGlobe } from 'src/components/Icon';

class AvailabilityActionLink extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  render(){
    return (
      <a href="#"
        className="action-icon"
        onClick={()=> this.setState({show: true})}
      >
        <IconGlobe/>
        {
          this.state.show
          ? <ServiceRegionAvailabilityModal 
              serviceId={this.props.serviceId}
              show={this.state.show} 
              onHide={()=>this.setState({show: false})}
              dialogClassName="modal-service-availability-list"
              size="lg"           
            />
          : ''
        }
      </a>
    )
  }
}

export default AvailabilityActionLink