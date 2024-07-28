const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return {
    location: location,
    message: msg,
    parameter: param,
    value: value,
    nestedErrors: nestedErrors,
  };
};

module.exports = errorFormatter;
