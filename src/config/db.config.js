import { mongoose } from "../utils/imports.util.js";
import { serverConfig } from "./serverConfig.js";

export default () =>
  mongoose
    .connect(serverConfig.DATABASE_URL)
    .then(() =>
      console.log(
        "CONNECTED TO DATABASE:",
        serverConfig.DATABASE_URL.split("/").pop()
      )
    )
    .catch((error) => console.log("DATABASE CONNECTION ERROR", error));
