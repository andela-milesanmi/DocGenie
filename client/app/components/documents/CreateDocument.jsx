import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Icon } from 'react-materialize';
import { createDocument, editDocument } from '../../actions/documentActions';


/**
* This is a pure function that receives properties as props parameter
* and is the parent component in which all other child components
* are displayed as "props.children".
* @param {object} props
* @returns a react element.
*/

class CreateDocument extends React.Component {
  constructor(props) {
  // Pass props back to parent
    super(props);
    this.state = { ...this.props.currentDocument };
    this.handleCreateDocument = this.handleCreateDocument.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state, "state in create document");
  }
  componentWillReceiveProps(nextProps) {
    // if(Object.keys(nextProps.currentDocument).length < 1) {
    //   console.log(nextProps.currentDocument, 'currentDocuent');
    //   const setValueToUndefined = Object.keys(this.state).reduce((acc, key) => {
    //    acc[key] = null;
    //    return acc;
    //   }, {});
    //   console.log(setValueToUndefined, 'keys')
    //   return this.setState(setValueToUndefined, () => {
    //     console.log(this.state, 'state');
    //   });
    // }
    return this.setState({ ...nextProps.currentDocument });
  }
  handleCreateDocument(event) {
    event.preventDefault();
    const title = event.target.title.value;
    const content = event.target.content.value;
    const access = event.target.access.value;
    console.log(event.target.title.value, event.target.content.value, event.target.access.value, 'create form data');
    !this.props.currentDocument.id ? this.props.createDocument({ title, content, access }) :
      this.props.editDocument({ title, content, access, id: this.props.currentDocument.id });
  }

  render() {
    const { user, currentDocument } = this.props;
    const { title, access, content } = this.state;
    return (
      <div>
        <Modal
          header={!currentDocument.title ? 'Create Document' : 'Edit Document'} id="create-form">
          <div className="row">
            <form className="col s12 m12" onSubmit={this.handleCreateDocument} action="#">
              <div className="error-message">{currentDocument.error}</div>
              <div className="row">
                <div className="input-field col s12">
                  <input name="title" id="title" type="text" className="validate" placeholder="Title" value={title} onChange={this.onChange}/>
                  <label htmlFor="title" />
                </div>
              </div>
              <div className="row">
                <select name="access" className="browser-default" onChange={this.onChange}>
                  <option value="" disabled selected>Select access</option>
                  <option value="0" selected={access}>Public</option>
                  <option value="-1" selected={access}>Private</option>
                  <option value={user.roleId} selected={access}>Role</option>
                </select>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <textarea name="content" id="content" className="materialize-textarea" placeholder="Body of document here..." value={this.state.content} onChange={this.onChange} />
                  <label htmlFor="content" />
                </div>
              </div>
              <button type="submit" className="btn btn-large create-doc right">
                SAVE
              </button>
            </form>
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
    user: state.user.currentProfile,
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createDocument
    createDocument: document => dispatch(createDocument(document)),
    editDocument: document => dispatch(editDocument(document))
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(CreateDocument);
