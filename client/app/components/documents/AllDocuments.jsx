import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createDocument } from '../../actions/documentActions';


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
  }
  componentDidMount() {
    this.props.viewAllDocuments();
  }
  render() {
    // return JSX
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
    createDocument: () => dispatch(createDocument())
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(CreateDocument);
