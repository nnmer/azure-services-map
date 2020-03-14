import React from 'react'
import { IconGraphRight } from 'src/components/Icon';
import ServicesDirectIOInteractiveGraphModal from '../ServicesDirectIOInteractiveGraphModal';

class GraphActionLink extends React.PureComponent {

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
        <IconGraphRight/> IO graph
        {
          this.state.show
          ? <ServicesDirectIOInteractiveGraphModal 
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

export default GraphActionLink