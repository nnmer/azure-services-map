import React from 'react'
import imgDrag from 'src/public/img/drag.png'
import imfScroll from 'src/public/img/scroll.png'

const D3CanvasControlNotice = props => {
  return (
    <div className="service-flow-action-icons text-right">
      <img src={imgDrag} className="drag-icon" title="Click and drag canvas" />
      <img src={imfScroll} className="scroll-icon" title="Scroll to zoom Up/Down" />
    </div>
  )
}

export default D3CanvasControlNotice