function reference({ id, name }) {
  if (!id) throw Error('Trying to render a reference snippet, but the id argument is missing.');

  return {
    reference: `urn:uuid:${id}`,
    ...(name && { display: name }),
  };
}

module.exports = {
  reference,
};
