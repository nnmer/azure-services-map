import React from 'react'
import PropTypes from 'prop-types'

const ServiceConnectionDescriptionLinks = props => {
  let {dataSource, ...rest} = props
  return (
    <span>
      {
        (typeof dataSource === 'string')
        ? <a href={dataSource} target="_blank">How-to doc <small>&#x2924;</small></a>
        : (typeof dataSource === 'object' && dataSource.length >= 1)
          ? <>
              {
                dataSource.length == 1
                ? <a href={dataSource[0]} target="_blank">How-to doc <small>&#x2924;</small></a>
                : <>
                    How-to doc:&nbsp;
                    {
                      dataSource.map( (connUrl, idx) => {
                        return (
                          <span key={idx}>
                            <a href={connUrl} target="_blank" >{idx+1} <small>&#x2924;</small></a>
                            {
                              idx+1 < dataSource.length
                              ? ' | '
                              : ''
                            }
                          </span>
                        )
                      })
                    }
                  </>
              }                
            </>
          : ''
      }      
    </span>
  )
}

ServiceConnectionDescriptionLinks.propTypes = {
  dataSource: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired
}

export default ServiceConnectionDescriptionLinks