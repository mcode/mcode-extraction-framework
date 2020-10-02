function reference({ id, name }) {
  return {
    reference: `urn:uuid:${id}`,
    ...(name && { display: name }),
  };
}

module.exports = {
  reference,
};
