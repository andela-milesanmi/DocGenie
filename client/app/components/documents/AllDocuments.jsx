import React from 'react';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { viewAllDocuments, changeCurrentDocument, deleteDocument,
  showOwnDocuments } from '../../actions/documentActions';
import CreateDocument from './CreateDocument.jsx';
import Search from '../Search.jsx';
import DocumentCard from './DocumentCard.jsx';


export class AllDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUrl: ''
    };
    this.showAllDocuments = this.showAllDocuments.bind(this);
    this.showOwnDocuments = this.showOwnDocuments.bind(this);
  }
  editDocument(document) {
    this.props.changeCurrentDocument(document);
  }
  componentDidMount() {
    this.showAllDocuments();
  }
  showAllDocuments() {
    const { page = '' } = this.props.params;
    this.setState({ currentUrl: '/api/documents/?page=' },
      () => {
        this.props.viewAllDocuments(this.state.currentUrl + page);
      });
  }
  showOwnDocuments() {
    const { params: { page = '' } } = this.props;
    const { user } = this.props;
    this.setState({
      currentUrl: `/api/users/${user.id}/documents/?page=` },
    () => {
      this.props.viewAllDocuments(this.state.currentUrl + page);
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.params.page !== nextProps.params.page) {
      this.props.viewAllDocuments(this.state.currentUrl + nextProps.params.page);
    }
  }
  render() {
    return (
      <div className="dashboard-container">
        <div className="row">
          <div className="col s8 offset-s3">
            <div className="row">
              <button className="col s3 btn btn-large create-doc"
                id="allDocuments"
                onClick={this.showAllDocuments}>All Documents</button>
              <button id="ownDocuments" className="col s3 btn btn-large create-doc"
                onClick={this.showOwnDocuments}>My Documents</button>
              <a href="#create-form" className="col s3 btn btn-large create-doc"
                onClick={() => this.editDocument()}>
               CREATE DOCUMENT
              </a>
            </div>
          </div>
          <CreateDocument />
        </div>
        <Search />
        <div className="col s12">
          <div className="row" style={{ fontSize: '15px' }}>
            <div className="col s10 offset-s1">
              {this.props.documents && this.props.documents.map((document, i) =>
                (
                <DocumentCard index={i} document={document} />
                )
              )}
            </div>
          </div>
          <div className="row paginate-docs">
            <ul className="pagination">
              {this.props.currentPage > 1 && <li><a href="#"
                onClick={() => {
                  browserHistory.push(`/dashboard/documents/${this.props.currentPage - 1}`);
                }}><i className="material-icons">chevron_left</i></a></li> }
              {Array(this.props.pages).fill(0).map((value, i) => {
                return (<li><a href="#" onClick={() => {
                  browserHistory.push(`/dashboard/documents/${i + 1}`);
                }}>{i + 1}</a></li>);
              })}
              {this.props.currentPage < this.props.pages &&
               <li className="waves-effect"><a href="#" onClick={() => {
                 browserHistory.push(`/dashboard/documents/${this.props.currentPage + 1}`);
               }}><i className="material-icons">chevron_right</i></a></li> }
            </ul>
          </div>
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
    user: state.user.currentProfile
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    viewAllDocuments: page => dispatch(viewAllDocuments(page)),
    changeCurrentDocument: document => dispatch(changeCurrentDocument(document)),
    deleteDocument: document => dispatch(deleteDocument(document)),
    showOwnDocuments: (id, page) => dispatch(showOwnDocuments(id, page)),
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

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(AllDocuments);
