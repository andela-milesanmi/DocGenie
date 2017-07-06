import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchForDocuments } from '../actions/documentActions';


export const Search = (props) => {
  const handleChange = (event) => {
    event.preventDefault();
    const searchKey = event.target.value;
    if (searchKey) props.searchForDocuments(searchKey);
  };
  return (
    <div className="row search-docs">
      <div className="col s8 offset-s2">
        <input name="searchKey" id="searchKey" type="text"
          className="validate" placeholder="Search for documents here..."
          onChange={handleChange}/>
      </div>
    </div>
  );
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.createDocument
    searchForDocuments: searchKey => dispatch(searchForDocuments(searchKey)),
  };
};

Search.propTypes = {
  searchForDocuments: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Search);
