function reference({ id, name, resourceType }) {
  if (!id) throw Error('Trying to render a reference snippet, but the id argument is missing.');

  return {
    reference: `urn:uuid:${id}`,
    ...(name && { display: name }),
    ...(resourceType && { type: resourceType }),
  };
}

module.exports = {
  reference,
};
