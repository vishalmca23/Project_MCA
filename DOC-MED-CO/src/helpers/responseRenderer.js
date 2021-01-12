/**
 * Render page with status code and message
 * @param {httpResponse} res
 * @param {Number} statusCode
 * @param {String} page File name
 * @param {String} message
 * @param {Object} details
 */
const renderPageWithMessage = (req, res, statusCode, page, message = null, details = null) => {
  res.status(statusCode);
  let username = null;
  if (req.user) {
    username = req.user.name;
  }
  return res.render(page, { message, details, username });
};

export default renderPageWithMessage;
