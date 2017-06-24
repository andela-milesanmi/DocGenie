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
    this.props.viewAllDocuments();
  }
  render() {
    // return JSX
    return (
      <div>
        <a href="#the-form" className="btn-floating btn-large create-doc right" onClick={() => this.editDocument()}>
          <i className="material-icons">create</i>
        </a>
        <div className="row">
          <h3 className="col s8" style={{ color: '#fff' }}>All Documents</h3>
          <CreateDocument />
        </div>
        <Search />
        <div className="col s12">
          <div className="row">
            {this.props.documents && this.props.documents.map((document, i) => (
              <DocumentCard index={i} document={document}/>
            )
            )}
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
    documents: state.documents.documents
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createDocument
    viewAllDocuments: () => dispatch(viewAllDocuments()),
    changeCurrentDocument: document => dispatch(changeCurrentDocument(document)),
    deleteDocument: document => dispatch(deleteDocument(document)),
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(AllDocuments);
