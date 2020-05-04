function getPatientName(name) {
  return `${name[0].given.join(' ')} ${name[0].family}`;
}

module.exports = {
  getPatientName,
};
