import React from 'react'
import IconLoading from 'src/icons/icon-loading.svg'

const LoadingPlaceholder = props => {
  return (
    <div className="text-center loader" {...props}><IconLoading /></div>
  )
}

export default LoadingPlaceholder