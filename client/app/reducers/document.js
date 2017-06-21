export const CREATE_DOCUMENT = 'CREATE_DOCUMENT';

export default (state = [], action) => {
  switch (action.type) {
  case CREATE_DOCUMENT:
    return [
      ...state,
      Object.assign({}, action.document)
    ];
  default:
    return state;
  }
};
