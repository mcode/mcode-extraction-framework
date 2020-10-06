function meta(profiles) {
  return {
    meta: {
      profile: profiles,
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
