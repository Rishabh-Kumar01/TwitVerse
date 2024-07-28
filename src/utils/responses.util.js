module.exports = {
  responseStatus400: (response, message, errors) =>
    response.status(400).send({ message, errors }),
  responseStatus401: (response, message, errors) =>
    response.status(401).send({ message, errors }),
  responseStatus403: (response, message, errors) =>
    response.status(403).send({ message, errors }),
  responseStatus404: (response, message, errors) =>
    response.status(404).send({ message, errors }),
  responseStatus500: (response, message, errors) =>
    response.status(500).send({ message, errors }),
  responseStatus200: (response, message, errors) =>
    response.status(200).send({ message, errors }),
  responseStatus201: (response, message, errors) =>
    response.status(201).send({ message, errors }),
};
