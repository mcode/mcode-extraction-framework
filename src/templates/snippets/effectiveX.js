function effectiveX(effective) {
  if (effective.high || effective.low) {
    return {
      effectivePeriod: {
        high: effective.high,
        low: effective.low,
      },
    };
  }
  return {
    effectiveDateTime: effective,
  };
}


module.exports = {
  effectiveX,
};
