import React from 'react';
import { connect } from 'react-redux';
import createDocument from '../../actions/documentActions';


/**
* This is a pure function that receives properties as props parameter
* and is the parent component in which all other child components
* are displayed as "props.children".
* @param {object} props
* @returns a react element.
*/

class Document extends React.Component {
  constructor(props) {
  // Pass props back to parent
    super(props);
  }
  onSubmit(e) {
    e.preventDefault();
    const { name: { value } } = e.target;
    this.props.createDocument(value);
  }

  render() {
    // Title input tracker
    // return JSX
    return (
      <div>
        <h3>Documents</h3>
        <div>
          <h3> Create Document</h3>
          <form onSubmit={this.onSubmit} >
            <input type="text" name="title" />
            <input type="submit" />
          </form>
          <ul>
            {/* Traverse books array  */}
            {this.props.documents.map((document, i) => <li key={i}>{document.title}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}
// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    // You can now say this.props.documents
    documents: state.documents
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createDocument
    createDocument: document => dispatch(createDocument(document))
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Document);
