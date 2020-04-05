import React from 'react'
import imgAzureServiceDefaultIcon from 'src/public/img/icon-azure-black-default.png'
import PeriodicTableServiceMenu from './PeriodicTableServiceMenu'
import AvailabilityActionLink from './AvailabilityActionLink';
import Routing, { routesUI } from 'src/helpers/routing';
import {Link} from 'react-router-dom'
import ServiceIconWithIoBadgeAndLink from 'src/components/ServiceIconWithIoBadgeAndLink';

class ServicesPeriodicTable extends React.PureComponent {

  serviceHasAvailability = (service) => {
    return service.hasOwnProperty('availability') && Object.keys(service.availability).length > 0
  }

  render () {
    return (
    <>
      <div className="service-list-container" data-simplebar data-simplebar-force-visible="true" data-simplebar-auto-hide="false">
        <div className="service-list m-none" >
          {
            Object.keys(this.props.filteredServicesList).map( (category, categoryIdx) => {
              return (
                <div className="service-list-col" 
                  key={`category-${categoryIdx}`}
                >
                  <div className="service-list-col-title text-center">
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
                                {
                                  this.serviceHasAvailability(service)
                                  ? <AvailabilityActionLink serviceId={service.id} />
                                  : ''
                                }
                              </div>

                              <div className="float-right" >
                                <PeriodicTableServiceMenu 
                                  serviceId={service.id}
                                />
                              </div>
                              <div className="clearfix"/>


                              <div className="icon-with-title m-t-7">
                                <ServiceIconWithIoBadgeAndLink
                                  title={service.name}
                                  serviceId={service.id}
                                  src={service.icon || imgAzureServiceDefaultIcon}
                                  hasIO={service.servicesIO.input && service.servicesIO.input.length >0 || service.servicesIO.output && service.servicesIO.output.length >0}
                                />
                                {/* <Link to={Routing.generate(routesUI.services.serviceHome, {serviceId: service.id})}> */}
                                  <div className="service-title text-center">
                                    <span title={service.name}>{service.name}</span>
                                  </div>
                                {/* </Link> */}
                                
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
    </>
    )
  }
}

export default ServicesPeriodicTable