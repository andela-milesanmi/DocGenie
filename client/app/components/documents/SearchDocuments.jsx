import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchForDocuments } from '../../actions/documentActions';

/**
 * Pure function, Search
 * @param {object} props
 */
export const SearchDocuments = (props) => {
  const handleChange = (event) => {
    event.preventDefault();
    const searchKey = event.target.value;
    const { limit, offset } = props;
    if (searchKey) props.searchForDocuments({ searchKey, limit, offset });
  };
  return (
    <div id="search-docs" className="row search-docs">
      <div className="col s10">
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
  // You can now say this.props.searchForDocuments
    searchForDocuments: searchData => dispatch(searchForDocuments(searchData)),
  };
};

SearchDocuments.propTypes = {
  searchForDocuments: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SearchDocuments);
