import React from 'react'
import PropTypes from 'prop-types'
import ServiceLinking from 'src/services/ServiceLinking'
import ServiceConnectionDescriptionLinks from './ServiceConnectionDescriptionLinks'
import ServiceIcon from 'src/components/ServiceIcon';

const ListServiceDirectIOEntries = props => {
  const getServiceData = serviceId => {
    return ServiceLinking.servicesUnfiltered[serviceId]
  }
  const hasService = serviceId => {
    return ServiceLinking.servicesUnfiltered[serviceId] || null
  }
  const serviceRenderName = ioItem => {
    return ioItem.aliasTitle || (hasService(ioItem.serviceId) ? getServiceData(ioItem.serviceId).name : ioItem.serviceId)
  }

  let {dataSource, ...rest} = props

  const icon = serviceId => {
    return (
      <ServiceIcon 
        hidden={!getServiceData(serviceId).icon}
        src={getServiceData(serviceId).icon}
      />
    )
  }

  return (
    <div>
      <table className="table table-hover ">
        <thead></thead>
        <tbody>
          {
            dataSource.map( (ioItem, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <div  className="direct-io-list-service-item-wrapper">
                      {
                        (ioItem.serviceId && hasService(ioItem.serviceId))
                        ? <>
                            <div className="service-icon float-left">
                              {
                                hasService(ioItem.serviceId)
                                ? <a href="#" onClick={()=>props.onSelectService(ioItem.serviceId)}>{icon(ioItem.serviceId)}</a>
                                : icon(ioItem.serviceId)
                              }
                              
                            </div>
                            <div className="float-left service-title">
                              {
                                hasService(ioItem.serviceId)
                                ? <a href="#" onClick={()=>props.onSelectService(ioItem.serviceId)}>{serviceRenderName(ioItem)}</a>
                                : serviceRenderName(ioItem)
                              }
                              </div>
                            <div className="float-right service-doc-links">
                              <a href={getServiceData(ioItem.serviceId).url} target="_blank">Service doc <small>&#x2924;</small></a>
                              <div hidden={!(ioItem.connectionDescriptionUrl && ioItem.connectionDescriptionUrl.length >= 1)}>
                                
                                <ServiceConnectionDescriptionLinks
                                  dataSource={ioItem.connectionDescriptionUrl || []}
                                />
                              </div>
                            </div>
                            <div className="clearfix"/>
                          </>
                        : <>
                            <div className="float-left service-title">
                              {ioItem.aliasTitle}
                            </div>
                            <div hidden={!(ioItem.connectionDescriptionUrl)} className="float-right service-doc-links">
                              <ServiceConnectionDescriptionLinks
                                dataSource={ioItem.connectionDescriptionUrl || []} 
                              />
                            </div>
                            <div className="clearfix"/>
                          </>
                      }
                    </div>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  )
}

ListServiceDirectIOEntries.propTypes = {
  dataSource: PropTypes.array.isRequired,
  onSelectService: PropTypes.func.isRequired
}

export default ListServiceDirectIOEntries