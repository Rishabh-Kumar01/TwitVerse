const utils = require("./utils/index.util");
const config = require("./config/index.config");
const routes = require("./routes/index.route");

const app = utils.imports.express();

// Middlewares
app.use(utils.imports.morgan("dev"));
app.use(utils.imports.cors());
app.use(utils.imports.helmet());
app.use(utils.imports.compression());
app.use(utils.imports.express.json());

// Server
const setupAndStartServer = () => {
  app.listen(config.serverConfig.PORT, async () => {
    console.log(`SERVER IS RUNNING ON PORT ${config.serverConfig.PORT}`);
    await config.connection();
  });
};

// Call the function to start the server
setupAndStartServer();

// Home Route
app.get("/", (request, response) => {
  response.send("Hello Server!!!😊😊😊😊");
});

module.exports = app;
