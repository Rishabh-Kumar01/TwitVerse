const { mongoose } = require("../utils/imports.util");
const serverConfig = require("./serverConfig");

module.exports = () =>
  mongoose
    .connect(serverConfig.DATABASE_URL)
    .then(() =>
      console.log(
        "CONNECTED TO DATABASE:",
        serverConfig.DATABASE_URL.split("/").pop()
      )
    )
    .catch((error) => console.log("DATABASE CONNECTION ERROR", error));
