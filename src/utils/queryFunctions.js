export const searchBooks = (searchString, searchFilterType = "none") => {
  let query = "";
  if (searchFilterType === "none") query += searchString;
  if (searchFilterType === "author") query += `inauthor:${searchString}`;
  if (searchFilterType === "subject") query += `insubject:${searchString}`;
  if (searchFilterType === "title") query += `intitle:${searchString}`;
  if (searchFilterType === "publisher") query += `inpublisher:${searchString}`;

  return query;
};

export const buildQueryParams = (params) => {
  const urlSearchParams = new URLSearchParams();
  for (const key in params) {
    if (params[key]) {
      urlSearchParams.append(key, params[key]);
    }
  }
  return urlSearchParams.toString();
};

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
};

export const encodeQueryParam = (param) => {
  return encodeURIComponent(param).replace(/'/g, "%27").replace(/"/g, "%22");
};
