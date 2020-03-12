import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import PropTypes from 'prop-types'

const DataUpdateInfo = props => {
  return (
    <OverlayTrigger
        trigger={['hover', 'click']}
        key='bottom'
        placement='bottom'
        overlay={
          <Popover id={`popover-data-update-info`}>
            <Popover.Content>
              <small>Services connections last update was on {props.lastConnectionsUpdate}</small>
              <br/>
              <small>Availability updates daily (last update was on {props.lastAvailabilityUpdate})</small>
            </Popover.Content>
          </Popover>
        }
      >
        <a
        id="update-status-popover-btn"
        className="mr-2 mt-1"
      >
        <small>Update status</small>
      </a>
    </OverlayTrigger>
  )
}

DataUpdateInfo.propTypes = {
  lastConnectionsUpdate: PropTypes.string.isRequired,
  lastAvailabilityUpdate: PropTypes.string.isRequired 
}

export default DataUpdateInfo