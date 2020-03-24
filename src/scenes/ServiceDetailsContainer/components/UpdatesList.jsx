import React from 'react'
import LoadingPlaceholder from 'src/components/LoadingPlaceholder';
import ProductsService from 'src/services/ProductsService';
import ReactPaginate from 'react-paginate';
import Dimmer from 'src/components/Dimmer';

class UpdateList extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      collection: null,
      pageCount: 1,
      currentPage: 1,
    }
  }

  componentDidMount() {
    return this.fetchData()
  }

  fetchData() {
    let {serviceId} = this.props.match.params
    return ProductsService.findUpdatesRecordsByServiceId(serviceId, {page: this.state.currentPage})
    .then( res => {
      this.setState({
        collection: res.data.rows,
        pageCount: res.data.pageCount,
        loading: false
      })
    })
  }

  handlePaginationClick = data => {
    this.setState({ currentPage: data.selected + 1, loading: true }, () => {
      this.fetchData()
    });
  };

  render() {

    if (null === this.state.collection) {
      return <LoadingPlaceholder />
    }
    
    if (this.state.collection.length == 0 ){
      return (
        <div className="text-center w-100">
          No data
        </div>
        
      )
    }

    return (
      <div>
        <Dimmer dimmed={this.state.loading} loading={this.state.loading}>
          <ul className="timeline">
          {
            this.state.collection.map( (item, idx) => {
              return (
                <li className="event" data-date={item.date}  key={idx}>
                  <div>
                  <a href={item.url} target="_blank">
                    <h3>{item.title} <small style={{fontSize: '50%'}}>&#x2924;</small></h3> 
                  </a>
                  </div>
                  <p>{item.descr}</p>
                </li>
              )
            })
          }
          </ul>
        </Dimmer>

        <div className="mt-4">
          <ReactPaginate
            previousLabel={'«'}
            nextLabel={'»'}
            breakLabel={'...'}
            breakLinkClassName={'page-link'}
            breakClassName={'page-item'}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            onPageChange={this.handlePaginationClick}
            containerClassName={'pagination pagination-sm'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      </div>
    )
  }
}

export default UpdateList