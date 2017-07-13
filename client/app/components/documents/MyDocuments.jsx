import React from 'react';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { viewAllDocuments, changeCurrentDocument, deleteDocument,
  showOwnDocuments } from '../../actions/documentActions';
import CreateDocument from './CreateDocument.jsx';
import Search from '../Search.jsx';
import DocumentCard from './DocumentCard.jsx';


/**
 * MyDocuments component, maps through a user's own documents and renders
 * each document as a DocumentCard component
 * @export
 * @class MyDocuments
 * @extends {React.Component}
 */
export class MyDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUrl: ''
    };
    this.showOwnDocuments = this.showOwnDocuments.bind(this);
  }

  /**
   * editDocument method, triggers changeCurrentDocument action
   * @param {object} document
   * @memberOf MyDocuments
   */
  editDocument(document) {
    this.props.changeCurrentDocument(document);
  }

  /**
   * componentDidMount, react lifecycle method which is invoked immediately the
   * component mounts
   * @memberOf MyDocuments
   */
  componentDidMount() {
    this.showOwnDocuments();
  }

  /**
   * showOwnDocuments, triggers viewAllDocuments action which displays all
   * a user's own documents
   * @memberOf MyDocuments
   */
  showOwnDocuments() {
    const { params: { page = '' } } = this.props;
    const { user } = this.props;
    this.setState({
      currentUrl: `/api/users/${user.id}/documents/?page=` },
    () => {
      this.props.viewAllDocuments(this.state.currentUrl + page);
    });
  }

  /**
   * componentWillReceiveProps, React lifecycle method which is called once a
   * component receives next props, in this case: next page
   * @param {object} nextProps
   * @memberOf MyDocuments
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.params.page !== nextProps.params.page) {
      this.props.viewAllDocuments(this.state.currentUrl + nextProps.params.page);
    }
  }

  /**
   * render, react lifecyle method
   * @returns a DOM element
   * @memberOf MyDocuments
   */
  render() {
    return (
      <div className="dashboard-container">
        <div className="row">
          <CreateDocument />
        </div>
        <div className="row">
          <div className="col s8 offset-s1">
            <Search />
          </div>
          <div className="col s2">
            <a href="#create-form" className="btn-floating
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
                <DocumentCard index={i} document={document} />
                )
              )}
            </div>
          </div>
          {/* pagination */}
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

MyDocuments.propTypes = {
  documents: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  params: PropTypes.object.isRequired,
  changeCurrentDocument: PropTypes.func.isRequired,
  viewAllDocuments: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(MyDocuments);
