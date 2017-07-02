import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'react-materialize';
import { changeCurrentDocument, deleteDocument }
  from '../../actions/documentActions';


class DocumentCard extends React.Component {
  constructor(props) {
  // Pass props back to parent
    super(props);
    this.state = {
      showMore: false
    };
    this.handleShowMore = this.handleShowMore.bind(this);
  }

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
    const { document, currentUser, currentDocument } = this.props;
    return (
      <div className="col s4 m4 darken-1">
        <div className="card">
          <div className="card-content white-text">
            <span style={{ color: '#000' }} className="card-title">{ document.title } on {document.createdAt.slice(0, 10)}</span>
            <p style={{ color: '#000' }}>{!this.state.showMore ? `${document.content.slice(0, 32)}...` : document.content }
              by {document.user.username}
              {!this.state.showMore && <a href="#view-more" onClick={() => this.editDocument(document)}>View More</a> }
            </p>
          </div>
          { currentUser.id === document.userId && <div className="card-action form-card-action">
            <a href="#create-form" onClick={() => this.editDocument(document)}>EDIT</a>
            <a href="#" onClick={() => this.deleteDocument(document)}>DELETE</a>
          </div> }
        </div>
        <Modal
          header={currentDocument.title} id="view-more">
          <div className="row">
            <p>
              {currentDocument.content}
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
    documents: state.documents.documents,
    currentUser: state.user.currentProfile,

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

DocumentCard.propTypes = {
  currentDocument: PropTypes.object.isRequired,
  documents: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  changeCurrentDocument: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(DocumentCard);
