import React from 'react'
import imgAzureServiceDefaultIcon from 'src/public/img/icon-azure-black-default.png'
import ServiceRegionAvailabilityModal from './ServiceRegionAvailabilityModal';
import PeriodicTableServiceMenu from './PeriodicTableServiceMenu'
import IconGlobe from 'src/icons/globe.svg'
import ServiceIcon from 'src/components/ServiceIcon';
import ServicesDirectIOModal from './ServicesDirectIOModal'
import ServicesDirectIOInteractiveGraphModal from './ServicesDirectIOInteractiveGraphModal';

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
    <>
      <div className="service-list-container" data-simplebar data-simplebar-force-visible="true" data-simplebar-auto-hide="false">
        <div className="service-list text-center m-none" >
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
                                  <IconGlobe width="16px"/>
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
                                  title={service.name}
                                  src={service.icon || imgAzureServiceDefaultIcon}
                                  hasIO={service.servicesIO.input && service.servicesIO.input.length >0 || service.servicesIO.output && service.servicesIO.output.length >0}
                                />
                                <div
                                  className="service-title">
                                <span title={service.name}>{service.name}</span>
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
          (null !== this.state.menuItemSelected && this.state.menuItemSelected.menuKey=='io-modal-graph')
          ? <ServicesDirectIOInteractiveGraphModal 
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
    </>
    )
  }
}

export default ServicesPeriodicTable