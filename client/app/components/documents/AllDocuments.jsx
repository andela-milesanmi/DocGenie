import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { viewAllDocuments, changeCurrentDocument }
  from '../../actions/documentActions';
import CreateDocument from './CreateDocument.jsx';
import SearchDocuments from './SearchDocuments.jsx';
import DocumentCard from './DocumentCard.jsx';

/**
 * AllDocuments component, maps through all documents and renders DocumentCard
 * component
 * @export
 * @class AllDocuments
 * @extends {React.Component}
 */
export class AllDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      limit: 6,
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  /**
  * editDocument method, triggers changeCurrentDocument action
  * @param {object} document
  * @memberOf AllDocuments
  */
  editDocument(document) {
    this.props.changeCurrentDocument(document);
  }

  /**
  * componentDidMount, react lifecycle method which is invoked immediately the
  * component mounts
  * @memberOf AllDocuments
  */
  componentDidMount() {
    const { limit, offset } = this.state;
    this.props.viewAllDocuments({ limit, offset });
  }

  /**
  * @description Allows user navigate pages by changing limit and offset
  * @param  {object} page
  * @return {void}
  */
  handlePageChange(page) {
    const { limit } = this.state;
    const selected = page.selected;
    const offset = Math.ceil(selected * this.state.limit);
    this.setState({ offset }, () => {
      this.props.viewAllDocuments({ limit, offset });
    });
  }

  /**
   * render, react lifecyle method
   * @returns a DOM element
   * @memberOf AllDocuments
   */
  render() {
    return (
      <div id="main-dash" className="dashboard-container">
        <h4 className="center-align">ALL DOCUMENTS</h4>
        <div className="row">
          <CreateDocument limit={this.state.limit} offset={this.state.offset}/>
        </div>
        <div className="row">
          <div className="col s8 offset-s1">
            <SearchDocuments limit={this.state.limit}
              offset={this.state.offset} />
          </div>
          <div className="col s2">
            <a id="create-doc-btn" href="#create-form" className="btn-floating
             btn-large waves-effect waves-light red right"
              onClick={() => this.editDocument()}>
              <i className="material-icons">add</i>
            </a>
          </div>
        </div>
        <div className="col s12">
          <div className="row" style={{ fontSize: '15px' }}>
            <div className="col s10 offset-s1">
              {this.props.documents && this.props.documents.map((document, i) =>
                (
                <DocumentCard index={i} document={document}
                  limit={this.state.limit} offset={this.state.offset}
                  key={document.id} />
                )
              )}
              {this.props.documents && this.props.documents.length === 0 &&
              <div className="center-align">
                <h5>Aww shucks...No documents found
                </h5>
              </div>}
            </div>
          </div>

          {/* pagination */}
          {this.props.documents && this.props.documents.length === 0 ? '' :
            (<div className="center-align">
              <ReactPaginate
                previousLabel={<i className="material-icons">chevron_left</i>}
                nextLabel={<i className="material-icons">chevron_right</i>}
                breakLabel={<a href="">...</a>}
                breakClassName={'break-me'}
                pageCount={this.props.pages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageChange}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active page-list'} />
            </div>
            )}
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    documents: state.documents.documents,
    pages: state.documents.pages,
    currentPage: state.documents.currentPage,
    user: state.user.currentProfile,
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    viewAllDocuments: paginationMetadata =>
      dispatch(viewAllDocuments(paginationMetadata)),
    changeCurrentDocument: document => dispatch(changeCurrentDocument(document)),
  };
};

AllDocuments.propTypes = {
  documents: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  params: PropTypes.object.isRequired,
  viewAllDocuments: PropTypes.func.isRequired,
  changeCurrentDocument: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllDocuments);
