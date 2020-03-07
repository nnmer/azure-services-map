import React from 'react'
import imgAzureServiceDefaultIcon from 'src/public/img/icon-azure-black-default.png'
import ServiceRegionAvailabilityModal from './ServiceRegionAvailabilityModal';
import PeriodicTableServiceMenu from './PeriodicTableServiceMenu'
import imgGlobe from 'src/public/img/icon_globe.svg'
import ServiceIcon from './ServiceIcon'
import ServicesDirectIOModal from './ServicesDirectIOModal'

class ServicesPeriodicTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuItemSelected: null
    }
  }

  setMenuItemSelected = (value) => {
    this.setState(prevState => ({menuItemSelected: value }))
  }

  onSelectServiceMenuItem = (serviceId, menuKey) => {
    this.setMenuItemSelected({
      serviceId, menuKey
    })
  }

  serviceHasAvailability = (service) => {
    return service.hasOwnProperty('availability') && Object.keys(service.availability).length > 0
  }

  render () {
    return (
      <div className="service-list-container data-container-table">
        <div className="service-list show-scroll-always row text-center m-none">
          {
            Object.keys(this.props.filteredServicesList).map( (category, categoryIdx) => {
              return (
                <div className="service-list-col" 
                  key={`category-${categoryIdx}`}
                >
                  <div className="service-list-col-title">
                    {category}
                  </div>
                  
                  {
                    this.props.filteredServicesList[category].map( service => {
                      return (
                          <div 
                              key={service.id}
                              id={`${categoryIdx}-${service.id}`}
                          >
                            <div className="service-list-col-service-item">
                              <div className="float-left" >
                                <a 
                                  href="#"
                                  className="action-icon"
                                  hidden={!this.serviceHasAvailability(service)}
                                  onClick={()=> this.onSelectServiceMenuItem(service.id, 'availability-modal')}
                                >
                                  <img src={imgGlobe} width="16px"/>
                                </a>
                              </div>

                              <div className="float-right" >
                                <PeriodicTableServiceMenu 
                                  serviceId={service.id}
                                  onSelect={this.onSelectServiceMenuItem}
                                />
                              </div>
                              <div className="clearfix"/>


                              <div className="m-t-7">
                                <ServiceIcon
                                  src={service.icon || imgAzureServiceDefaultIcon}
                                />
                                <div
                                  className={`service-title 
                                  ${service.servicesIO.input && service.servicesIO.input.length >0 || service.servicesIO.output && service.servicesIO.output.length >0 
                                    ? 'has-linking-services' 
                                    : ''
                                  }`}
                                >
                                {service.name}
                                </div>
                              </div>
                            </div>
                          </div>
                      )
                    })
                  }
                  
                </div>
              )
            })
          }        
        </div>

        {
          (null !== this.state.menuItemSelected && this.state.menuItemSelected.menuKey=='io-modal')
          ? <ServicesDirectIOModal 
              serviceId={this.state.menuItemSelected.serviceId} 
              show={null !== this.state.menuItemSelected}
              onHide={()=>this.setMenuItemSelected(null)}
            />
          : ''
        }

        {
          (null !== this.state.menuItemSelected && this.state.menuItemSelected.menuKey=='availability-modal')
          ? <ServiceRegionAvailabilityModal 
              show={null !== this.state.menuItemSelected} 
              onHide={()=>this.setMenuItemSelected(null)}
              dialogClassName="modal-service-availability-list"
              size="lg"           
              serviceId={this.state.menuItemSelected.serviceId}
            />
          : ''
        }
      </div>
    )
  }
}

export default ServicesPeriodicTable