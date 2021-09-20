const { coding } = require('./coding');

function medicationTemplate({ code, codeSystem, displayText }) {
  return {
    medicationCodeableConcept: {
      coding: [coding({ system: codeSystem, code, display: displayText }),
      ],
    },
  };
}

module.exports = {
  medicationTemplate,
};
