import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { searchForDocuments } from '../actions/documentActions';


const Search = (props) => {
  const handleChange = (event) => {
    event.preventDefault();
    console.log(event.target.value, 'searckey');
    const searchKey = event.target.value;
    if (searchKey) props.searchForDocuments(searchKey);
  };
  return (
    <div className="row search-docs">
      <div className="col s8 offset-s2">
        <input name="searchKey" id="searchKey" type="text"
          className="validate" placeholder="Search for documents here..." onChange={handleChange} style={{ color: 'white' }}/>
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

export default connect(null, mapDispatchToProps)(Search);
