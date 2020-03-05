import React from 'react'
import imgAzureServiceDefaultIcon from 'src/public/img/icon-azure-black-default.png'
import ServiceRegionAvailabilityModal from './ServiceRegionAvailabilityModal';
import PeriodicTableServiceMenu from './PeriodicTableServiceMenu'
import ServiceIcon from './ServiceIcon'

const ServicesPeriodicTable = props => {

  const serviceHasAvailability = (service) => {
    return service.hasOwnProperty('availability') && Object.keys(service.availability).length > 0
  }

  return (
    <div className="service-list-container data-container-table">
      <div className="service-list show-scroll-always row text-center m-none">
        {
          Object.keys(props.filteredServicesList).map( (category, categoryIdx) => {
            return (
              <div className="service-list-col" 
                key={`category-${categoryIdx}`}
              >
                <div className="service-list-col-title">
                  {category}
                </div>

                
                {
                  props.filteredServicesList[category].map( service => {
                    return (
                        <div 
                            key={service.id}
                            id={`${categoryIdx}-${service.id}`}
                        >
                          <div className="service-list-col-service-item">
                            <div className="float-left" >
                              <ServiceRegionAvailabilityModal 
                                hidden={!serviceHasAvailability(service)}
                                service={service}
                              />
                              
                            </div>

                            <div className="float-right" >
                              <PeriodicTableServiceMenu 
                                service={service}
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
    </div>
  )
}

export default ServicesPeriodicTable