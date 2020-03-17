import React from 'react'
import GitHubReference from 'src/components/GitHubReference';

const MainMenu = props => {
  return (
      <div className="navbar navbar-expand-lg fixed-top navbar-dark">
        <div className="container">
          <a href="/" className="navbar-brand">Azure Services IO</a>
          {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button> */}
          {/* <div className="collapse navbar-collapse" id="navbarResponsive"> */}
            {/* <ul className="navbar-nav mr-auto"> */}
            {/* </ul> */}
            <div>
              <GitHubReference />
            </div>
          {/* </div> */}
        </div>
      </div>
  )
}

export default MainMenu