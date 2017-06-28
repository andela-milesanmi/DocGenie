import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { viewAllDocuments, changeCurrentDocument, deleteDocument } from '../../actions/documentActions';
import CreateDocument from './CreateDocument.jsx';
import Search from '../Search.jsx';
import DocumentCard from './DocumentCard.jsx';

/**
* This is a pure function that receives properties as props parameter
* and is the parent component in which all other child components
* are displayed as "props.children".
* @param {object} props
* @returns a react element.
*/

class AllDocuments extends React.Component {
  constructor(props) {
  // Pass props back to parent
    super(props);
  }
  editDocument(document) {
    this.props.changeCurrentDocument(document);
  }
  componentDidMount() {
    console.log(this.props.params, 'whatever');
    this.props.viewAllDocuments(this.props.params.page);
  }
  render() {
    console.log(this.props.pages, 'pages');
    // return JSX
    return (
      <div>
        <a href="#create-form" className="btn-floating btn-large create-doc right" onClick={() => this.editDocument()}>
          <i className="material-icons">create</i>
        </a>
        <div className="row">
          <h3 className="col s8" style={{ color: '#fff' }}>All Documents</h3>
          <CreateDocument />
        </div>
        <Search />
        <div className="col s12">
          <div className="row" style={{ fontSize: '15px' }}>
            {this.props.documents && this.props.documents.map((document, i) => (
              <DocumentCard index={i} document={document} />
            )
            )}
          </div>
          <div className="row paginate-docs">
            <ul className="pagination">
              {this.props.currentPage > 1 && <li><a href={`/dashboard/documents/${this.props.currentPage - 1}`}><i className="material-icons">chevron_left</i></a></li> }
              {Array(this.props.pages).fill(0).map((v, i) => {
                return <li><a href={`/dashboard/documents/${i + 1}`}>{i + 1}</a></li>;
              })}
              {this.props.currentPage < this.props.pages && <li className="waves-effect"><a href={`/dashboard/documents/${this.props.currentPage + 1}`}><i className="material-icons">chevron_right</i></a></li> }
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
    // You can now say this.props.books
    documents: state.documents.documents,
    pages: state.documents.pages,
    currentPage: state.documents.currentPage
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createDocument
    viewAllDocuments: page => dispatch(viewAllDocuments(page)),
    changeCurrentDocument: document => dispatch(changeCurrentDocument(document)),
    deleteDocument: document => dispatch(deleteDocument(document)),
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(AllDocuments);
