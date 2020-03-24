import React from 'react'
import PropTypes from 'prop-types';
import classnames from 'classnames'
import LoadingPlaceholder from './LoadingPlaceholder';

class Dimmer extends React.Component {
  render() {
    return (
      <div className={classnames({'dimmed': this.props.dimmed})}>
        {this.props.children}
        <div className="dimmer">
          <div className="content">
              {this.props.content || this.props.loading ? <LoadingPlaceholder /> : ''}
          </div>          
        </div>
      </div>
    )
  }
}

Dimmer.propTypes = {
  children: PropTypes.element.isRequired,
  dimmed: PropTypes.bool,
  loading: PropTypes.bool,
};

Dimmer.defaultProps = {
  dimmed: false,
  loading: false,
}

export default Dimmer