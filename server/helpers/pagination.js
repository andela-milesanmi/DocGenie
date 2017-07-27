const paginationMetadata = (count, rows, limit, offset) => ({
  totalCount: count,
  pages: Math.ceil(count / limit),
  currentPage: Math.floor(offset / limit) + 1,
  pageSize: rows.length,
});

export default paginationMetadata;
