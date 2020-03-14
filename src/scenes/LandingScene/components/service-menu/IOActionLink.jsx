import React from 'react'
import ServicesDirectIOModal from '../ServicesDirectIOModal';
import { IconIO } from 'src/components/Icon';

class IOActionLink extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  render(){
    return (
      <a href="#" 
        className="dropdown-item" 
        onClick={()=> this.setState({show: true})}
      >
        <IconIO/> Direct I/O services
        {
          this.state.show
          ? <ServicesDirectIOModal
              serviceId={this.props.serviceId} 
              show={this.state.show} 
              onHide={()=>this.setState({show: false})}
            />
          : ''
        }
      </a>
    )
  }
}

export default IOActionLink