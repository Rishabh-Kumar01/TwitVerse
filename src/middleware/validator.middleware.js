import { utils } from "../utils/index.util.js";

export default (request, response, next) => {
  const { validationResult } = utils.imports.expressValidator;
  const errors = validationResult(request).formatWith(utils.errorFormatter);

  if (!errors.isEmpty()) {
    return utils.responses.responseStatus400(
      response,
      "Validation failed",
      errors.array()
      // errors.errors.map((error) => error.msg).join(", ")
    );
  } else {
    next();
  }
};
