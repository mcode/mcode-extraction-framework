function periodTemplate({ startDate, endDate }) {
  return {
    period: {
      ...(startDate && { start: startDate }),
      ...(endDate && { end: endDate }),
    },
  };
}

module.exports = {
  periodTemplate,
};
