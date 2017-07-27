import axios from 'axios';

const setAxiosHeader = (token) => {
  if (token) {
    axios.defaults.headers.common.authorization = token;
  } else {
    delete axios.defaults.headers.common.authorizaton;
  }
};

export default setAxiosHeader;
