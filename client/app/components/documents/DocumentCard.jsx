import React from 'react';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import toastr from 'toastr';
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
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this document',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EE6352',
      confirmButtonText: 'Yes, Please',
      closeOnConfirm: false
    }, (isConfirm) => {
      if (isConfirm) {
        this.props.deleteDocument(document)
          .then(() => {
            swal('Deleted!', 'The selected file has been deleted.', 'success');
          })
          .catch(() => {
            toastr.error('Unable to delete document');
          });
      } else {
        swal('Cancelled', 'Your document is safe :)', 'error');
      }
    });
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
            <p><b>Author:</b> {document.user.fullname}</p>
            <p><b>Date:</b> {document.createdAt.slice(0, 10)}</p>
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
            <a href="#" onClick={() => {
              browserHistory.replace(`/dashboard/documents/view/${document.id}`);
            }}>
              VIEW MORE
            </a>
            }
          </div>
        </div>
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
