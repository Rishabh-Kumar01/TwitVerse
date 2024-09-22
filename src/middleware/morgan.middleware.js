import { morgan, chalk } from "../utils/imports.util.js";
import { DateTime } from "luxon";

const customMorgan = morgan((tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = tokens.status(req, res);
  const responseTime = tokens["response-time"](req, res);
  const date = DateTime.now()
    .setZone("Asia/Kolkata")
    .toFormat("EEE, dd LLL yyyy HH:mm:ss");

  let backgroundColorFunc;
  switch (method) {
    case "GET":
      backgroundColorFunc = chalk.bgGreen;
      break;
    case "POST":
      backgroundColorFunc = chalk.bgYellow;
      break;
    case "PATCH":
      backgroundColorFunc = chalk.bgBlue;
      break;
    case "PUT":
      backgroundColorFunc = chalk.bgCyan;
      break;
    case "DELETE":
      backgroundColorFunc = chalk.bgRed;
      break;
    default:
      backgroundColorFunc = chalk.bgWhite;
  }

  const coloredPart = backgroundColorFunc(
    chalk.white(`"${method} ${url} ${status} ${responseTime} ms"`)
  );
  const logMessage = `[${date} IST] ${coloredPart}`;

  return logMessage;
});

export default customMorgan;
