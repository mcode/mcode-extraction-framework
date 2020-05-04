class NotImplementedError extends Error {
  constructor(...args) {
    super(...args);

    this.name = 'NotImplementedError';
    Error.captureStackTrace(this, NotImplementedError);
  }
}

module.exports = {
  NotImplementedError,
};
