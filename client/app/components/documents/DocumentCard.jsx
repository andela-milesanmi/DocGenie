import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'react-materialize';
import { changeCurrentDocument, deleteDocument }
  from '../../actions/documentActions';


/**
 * DocumentCard component renders each document
 * @export
 * @class DocumentCard
 * @extends {React.Component}
 */
export class DocumentCard extends React.Component {
  constructor(props) {
  // Pass props back to parent
    super(props);
    this.state = {
      showMore: false
    };
    this.handleShowMore = this.handleShowMore.bind(this);
  }

  /**
   * editDocument method triggers changeCurrentDocument action
   * @param {object} document
   * @memberOf DocumentCard
   */
  editDocument(document) {
    this.props.changeCurrentDocument(document);
  }

  /**
   * deleteDocument method triggers deleteDocument action
   * @param {object} document
   * @memberOf DocumentCard
   */
  deleteDocument(document) {
    this.props.deleteDocument(document);
  }

  /**
  * handleShowMore method toggles state property, showMore
  * @memberOf DocumentCard
  */
  handleShowMore() {
    this.setState({ showMore: !this.state.showMore });
  }

  /**
   * render, React lifecycle method
   * @returns a DOM element
   * @memberOf DocumentCard
   */
  render() {
    // document props is passed down from the parent component, AllDocuments
    const { document, currentUser, currentDocument } = this.props;
    return (
      <div className="col s4 darken-1">
        <div className="card document-card">
          <div className="card-content">
            <span className="card-title document-card-title">
              { document.title }
            </span>
            <p>Author: {document.user.fullname}</p>
            <p>Date: {document.createdAt.slice(0, 10)}</p>
          </div>
          <div className="card-action form-card-action">
            { currentUser.id === document.userId &&
              <span>
                <a id="edit" href="#create-form"
                  onClick={() => this.editDocument(document)}>EDIT
                </a>
                <a id="delete" href="#"
                  onClick={() => this.deleteDocument(document)}>DELETE
                </a>
              </span>
            }
            {!this.state.showMore &&
              <a id="viewMore" href="#view-more"
                onClick={() => this.editDocument(document)}>View More
              </a> }
          </div>
        </div>

        {/*Modal to display full document content on VIEW MORE button click*/}
        <Modal
          modalOptions={{
            complete: () => {
              this.props.changeCurrentDocument();
            }
          }}
          header={currentDocument.title} id="view-more">
          <div className="row">
            <p>
              Content: {currentDocument.content}
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
    // You can now say this.props.documents
    currentDocument: state.documents.currentDocument || {},
    documents: state.documents.documents,
    currentUser: state.user.currentProfile,
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.changeCurrentDocument
    changeCurrentDocument: document => dispatch(changeCurrentDocument(document)),
    deleteDocument: document => dispatch(deleteDocument(document)),
  };
};

DocumentCard.propTypes = {
  currentDocument: PropTypes.object.isRequired,
  documents: PropTypes.array.isRequired,
  document: PropTypes.object.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  changeCurrentDocument: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(DocumentCard);
