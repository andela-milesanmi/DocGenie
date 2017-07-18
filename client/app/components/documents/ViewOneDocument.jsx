import React from 'react';
import renderHtml from 'react-render-html';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findADocument } from '../../actions/documentActions';


/**
 * ViewOneDocument component, displays full content of one document when user
 * clicks on viewMore link in DocumentCard Component
 * @export
 * @class ViewOneDocument
 * @extends {React.Component}
 */
export class ViewOneDocument extends React.Component {
  /**
   * componentDidMount, react lifecycle method which is invoked immediately the
   * component mounts
   * @memberOf ViewOneDocument
   */
  componentDidMount() {
    this.props.findADocument(this.props.params.id);
  }

  /**
   * render, react lifecyle method
   * @returns a DOM element
   * @memberOf ViewOneDocument
   */
  render() {
    const { document } = this.props;
    return (
      <div className="container">
        <div className="row viewOneDocument">
          {document &&
            <div className="col s10 offset-s1">
              <h4>Title: {document.title}</h4>
              <hr/>
              <div className="row">
                <p>
                  <i>
                    <b>Date Published: </b> {document.createdAt.slice(0, 10)}
                  </i>
                </p>
              </div>
              {renderHtml(document.content)}
            </div>}
        </div>
      </div>
    );
  }
}
// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    document: state.documents.document,
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    findADocument: id => dispatch(findADocument(id)),
  };
};

ViewOneDocument.propTypes = {
  documents: PropTypes.array.isRequired,
  findADocument: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(ViewOneDocument);
