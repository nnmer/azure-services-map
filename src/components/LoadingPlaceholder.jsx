import React from 'react'
import IconLoading from 'src/icons/icon-loading.svg'

const LoadingPlaceholder = props => {
  let {alignCenter, ...rest} = props
  return (
    <div className="text-center loader" {...rest}><IconLoading /></div>
  )
}

export default LoadingPlaceholder