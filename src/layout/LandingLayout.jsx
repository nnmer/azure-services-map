import React from 'react'
import PropTypes from 'prop-types'
import MainMenu from 'src/components/pageBlock/MainMenu';
import ErrorBoundary from 'src/components/ErrorBoundary';

const LandingLayout = props => {
  
  const {component: Component, ...rest} = props

  return (
    <>
      <MainMenu />
      <ErrorBoundary>
        <Component {...rest} />
      </ErrorBoundary>
    </>
  )
}

LandingLayout.propTypes = {
  component: PropTypes.elementType.isRequired
}

export default LandingLayout
