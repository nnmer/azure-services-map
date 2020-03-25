import React from 'react'
import PropTypes from 'prop-types'
import config from 'src/config';

class PageTitle extends React.Component {

  componentDidMount() {
    let title = this.props.title || ''
    let subTitle = this.props.subTitle || ''
    document.title = (subTitle && subTitle.length > 0 ? `${subTitle} | ` : '') + (title && title.length > 0 ? `${title} | ${config.defaultPageTitle}` : config.defaultPageTitle)
  }
  componentWillUnmount() {
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
}

export default PageTitle
