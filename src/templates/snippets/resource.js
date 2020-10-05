function meta(profiles) {
  return {
    meta: {
      profile: profiles.map((p) => p),
    },
  };
}

function narrative(status, div) {
  return {
    status,
    div,
  };
}

module.exports = {
  meta,
  narrative,
};
