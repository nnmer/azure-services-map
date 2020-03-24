import React from 'react'
import PropTypes from 'prop-types'
import MainMenu from 'src/components/pageBlock/MainMenu';
import ErrorBoundary from 'src/components/ErrorBoundary';

const DefaultLayout = props => {
  
  const {component: Component, ...rest} = props

  return (
    <>
      <MainMenu />
      <ErrorBoundary>
        <div className="container">
          <Component {...rest} />
        </div>
      </ErrorBoundary>
    </>
  )
}

DefaultLayout.propTypes = {
  component: PropTypes.elementType.isRequired
}

export default DefaultLayout
