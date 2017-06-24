import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Icon } from 'react-materialize';
import { changeCurrentDocument, deleteDocument } from '../../actions/documentActions';
// import CreateDocument from './CreateDocument.jsx';
import Search from '../Search.jsx';
/**
* This is a pure function that receives properties as props parameter
* and is the parent component in which all other child components
* are displayed as "props.children".
* @param {object} props
* @returns a react element.
*/

class DocumentCard extends React.Component {
  constructor(props) {
  // Pass props back to parent
    super(props);
    this.state = {
      showMore: false
    };
    this.handleShowMore = this.handleShowMore.bind(this);
  }
  // changeDocumentView() {
  //   this.props.changeCurrentDocument()
  // }
  editDocument(document) {
    this.props.changeCurrentDocument(document);
  }
  deleteDocument(document) {
    this.props.deleteDocument(document);
  }
  handleShowMore() {
    this.setState({ showMore: !this.state.showMore });
  }
  render() {
    // return JSX
    return (
      <div index={this.props.i} className="col s4 m4 darken-1">
        <div className="card">
          <div className="card-content white-text">
            <span style={{ color: '#000' }} className="card-title">{ this.props.document.title }</span>
            <p style={{ color: '#000' }}>{!this.state.showMore ? this.props.document.content.slice(0, 32) + '...' : this.props.document.content }
              {!this.state.showMore && <a href="#view-more" onClick={() => this.editDocument(this.props.document)}>View More</a> }
              {this.state.showMore && <a onClick={this.handleShowMore}> View Less </a> }</p>
          </div>
          <div className="card-action form-card-action">
            <a href="#the-form" onClick={() => this.editDocument(this.props.document)}>EDIT</a>
            <a href="#" onClick={() => this.deleteDocument(this.props.document)}>DELETE</a>
          </div>
        </div>
        <Modal
          header={this.props.currentDocument.title} id="view-more">
          <div className="row">
            <p>
              {this.props.currentDocument.content}
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}
// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.books
    currentDocument: state.documents.currentDocument || {},
    documents: state.documents.documents
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createDocument
    changeCurrentDocument: document => dispatch(changeCurrentDocument(document)),
    deleteDocument: document => dispatch(deleteDocument(document)),
  };
};
// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(DocumentCard);
