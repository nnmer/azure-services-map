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
                    <div>
                      {
                        (ioItem.serviceId && hasService(ioItem.serviceId))
                        ? <div className="direct-io-list-service-item-wrapper-icon">
                            <div className="float-left">
                              <ServiceIcon 
                                containerClass="float-left "
                                hidden={!getServiceData(ioItem.serviceId).icon}
                                src={getServiceData(ioItem.serviceId).icon}
                              />
                            </div>
                            <div className="float-left direct-io-list-service-title">
                              {
                                hasService(ioItem.serviceId)
                                ? <a href="#" onClick={()=>props.onSelectService(ioItem.serviceId)}>{serviceRenderName(ioItem)}</a>
                                : serviceRenderName(ioItem)
                              }
                              </div>
                            <div className="float-right direct-io-list-service-doc-links">
                              <a href={getServiceData(ioItem.serviceId).url} target="_blank">Service doc</a>
                              <span hidden={!(ioItem.connectionDescriptionUrl && ioItem.connectionDescriptionUrl.length >= 1)}>
                                &nbsp;|&nbsp;
                                <ServiceConnectionDescriptionLinks
                                  dataSource={ioItem.connectionDescriptionUrl || []}
                                />
                              </span>
                            </div>
                            <div className="clearfix"/>
                          </div>
                        : <>
                            <div className="float-left direct-io-list-service-title">
                              {ioItem.aliasTitle}
                            </div>
                            <div hidden={!(ioItem.connectionDescriptionUrl)} className="float-right direct-io-list-service-doc-links">
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