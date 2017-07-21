module.exports = {
  filterSequelizeErrorMessage(error) {
    if (error.indexOf('error:') !== -1) {
      const sliceIndex = 'error:'.length + error.indexOf('error:') + 1;
      return error.slice(sliceIndex);
    }
    return error;
  }
};
