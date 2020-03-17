import React from 'react'

const BrowserNotSupported = props => {
  let text = ''
  switch(props.browser && props.browser.name) {
      case 'ie':
        text = 'Sorry, Internet Explorer is not supported.'
      default:
        text = 'Sorry, this browser is not supported.'
  }


  return (
    <div className="text-center">
      <h2>{text}</h2>
      <h2>Please try some other browser.</h2>
    </div>
  )
}

export default BrowserNotSupported