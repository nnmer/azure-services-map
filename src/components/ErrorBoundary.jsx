import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-center">
        <h2>Ooops, something happen,</h2>
        <h2>we will fix that as soon as possible,</h2>
        <h2>please try again later</h2>

      </div>
    }
    return this.props.children;
  }
}