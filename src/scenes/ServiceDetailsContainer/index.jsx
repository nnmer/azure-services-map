import React from 'react'
import LoadingPlaceholder from 'src/components/LoadingPlaceholder';
import ProductsService from 'src/services/ProductsService';
import ServiceIcon from 'src/components/ServiceIcon';
import {Switch, Link, Route, Redirect} from 'react-router-dom'
import 'src/scenes/ServiceDetailsContainer/styles.scss'
import { IconBook } from 'src/components/Icon';
import UpdateList from './components/UpdatesList';
import Routing, { routesUI } from 'src/helpers/routing';
import classnames from 'classnames'

class ServiceDetailsContainer extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      serviceInfo: null
    }
  }

  componentDidMount() {
    ProductsService.findDetailsByServiceId(this.props.match.params.serviceId)
      .then( (res) => {
        this.setState({
          serviceInfo: res.data
        })
      })
  }

  matchUrl(str) {
    return window.location.pathname.match(new RegExp('^'+str.replace(['/'],['\/'])))
  }

  render () {

    if (!this.state.serviceInfo) {
      return <LoadingPlaceholder />
    }
    let {serviceId} = this.props.match.params    
    let {serviceInfo} = this.state

    return (
      <div className="service-page">
        <div className="row"> 
          <div className="col">
            <div className="mt-4 service-caption ">
              <ServiceIcon 
                src={serviceInfo.officialIcon}
              />
              <div className="ml-3">
                <h3>{serviceInfo.name}</h3>
                <div className="">
                  {serviceInfo.category.map((i, idx)=><span className="badge badge-dark" key={idx}>{i}</span>)}
                </div>
              </div>
            </div>          
          </div>
          <div className="col mt-4 text-right">
            <div className="mt-3 text-muted">
              <i>{serviceInfo.description}</i>
            </div>
          </div>
        </div>
        
          <div className="row mt-5 service-horizontal-menu">
            <div className="col">
              <a href="#" href={serviceInfo.officialUrl} target="_blank">
                <IconBook /> Service doc  <small>&#x2924;</small>
              </a>
              
              <Link 
                className={classnames({active: this.matchUrl(Routing.generate(routesUI.services.updatesList, {serviceId}))})}
                to={Routing.generate(routesUI.services.updatesList, {serviceId})}>
                Service Updates
              </Link>
            </div>
          </div>             
          <div className="row mt-4">
            <div className="col">
              <Switch>
                <Route path={routesUI.services.updatesList} render={ routeProps=> <UpdateList {...routeProps} pageTitle={`${serviceInfo.name} service updates`} /> } />
                <Route  render={() => (<Redirect to={Routing.generate(routesUI.services.updatesList, {serviceId})} />)} /> 
              </Switch>
            </div>
          </div>          
      </div>
    )
    
  }
}

export default ServiceDetailsContainer