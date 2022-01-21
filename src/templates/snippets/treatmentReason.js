const { coding } = require('./coding');

function treatmentReasonTemplate({ treatmentReasonCode, treatmentReasonCodeSystem, treatmentReasonDisplayText }) {
  return {
    reasonCode: [
      {
        coding: [coding({ system: treatmentReasonCodeSystem, code: treatmentReasonCode, display: treatmentReasonDisplayText }),
        ],
      },
    ],
  };
}

module.exports = {
  treatmentReasonTemplate,
};
