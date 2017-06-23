import React from 'react';
import { connect } from 'react-redux';
import { viewAllDocuments } from '../../actions/documentActions';


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
  componentDidMount() {
    this.props.viewAllDocuments();
  }
  render() {
    // return JSX
    console.log(this.props.documents, 'documents');
    return (
      <div>
        <div className="row">
          <h3 className="col s8" style={{ color: '#fff' }}>All Documents</h3>
          <a className="btn-floating btn-large waves-effect waves-light right create-doc"><i className="material-icons">add</i></a>
        </div>
        <div className="col s12">
          <div className="row">
            {this.props.documents && this.props.documents.map((document, i) => (
              <div index={i} className="col s4 m4 darken-1">
                <div className="card">
                  <div className="card-content white-text">
                    <span style={{ color: '#000' }} className="card-title">{ document.title }</span>
                    <p style={{ color: '#000' }}>{ document.content }</p>
                  </div>
                  <div className="card-action">
                    <a href="#">EDIT</a>
                    <a href="#">DELETE</a>
                  </div>
                </div>
              </div>
            )
            )};
          </div>
        </div>
        {/* <ul>
            {/* Traverse books array  */}
        {/* {this.props.documents && this.props.documents.map((document, i) => <li key={i}>{document.title}, {document.content}</li>)}*/}
        {/* </ul>*/}
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
    viewAllDocuments: () => dispatch(viewAllDocuments())
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(AllDocuments);
