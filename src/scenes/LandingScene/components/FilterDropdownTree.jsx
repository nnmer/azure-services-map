import React from 'react'
import DropdownTreeSelect from 'react-dropdown-tree-select'
import isEqual from 'lodash/isEqual'

class FilterDropdownTree extends React.Component {
  constructor(props){
    super(props)
    this.state = { data: [...props.data] }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if(nextProps && !isEqual(nextProps.data, this.state.data)) {
      this.setState({ data: nextProps.data })
    }
  }

  shouldComponentUpdate = (nextProps) => {
    return nextProps && !isEqual(nextProps.data, this.state.data)
  }

  render() {
    const { data, ...rest } = this.props
    
    return (
      <DropdownTreeSelect data={this.state.data} {...rest} />
    )
  }
}

export default FilterDropdownTree 