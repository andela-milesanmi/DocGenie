import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchForUsers } from '../../actions/userActions';

/**
 * Pure function, Search
 * @param {object} props
 */
export const SearchUsers = (props) => {
  // handleChange function triggers searchForUsers action on input change
  const handleChange = (event) => {
    event.preventDefault();
    const searchKey = event.target.value;
    if (searchKey) props.searchForUsers(searchKey);
  };
  return (
    <div className="row search-docs">
      <div className="col s12">
        <input name="searchKey" id="searchKey" type="text"
          className="validate" placeholder="Search for a user here..."
          onChange={handleChange}/>
      </div>
    </div>
  );
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
  // You can now say this.props.searchForDocuments
    searchForUsers: searchKey => dispatch(searchForUsers(searchKey)),
  };
};

SearchUsers.propTypes = {
  searchForUsers: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SearchUsers);
