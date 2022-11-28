/**
 * Response Model for successful response
 * @export
 * @class Response
 */
module.exports = class Response {
  constructor(
    result = {},
    responseMessage = "Operation completed successfully",
    statusCode = 200

  ) {
    this.result = result || {};
    this.responseMessage = responseMessage;
    this.statusCode = statusCode || 200;
  }
}
