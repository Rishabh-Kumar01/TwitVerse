import {
  express,
  morgan,
  compression,
  helmet,
  cors,
  bodyParser,
  passport,
} from "./utils/imports.util.js";
import baseError from "../src/error/base.error.js";
import {
  serverConfig,
  dbConnect,
  passportAuth,
} from "./config/index.config.js";
import routes from "./route/index.route.js";

const app = express();

const serverStart = async () => {
  // Middlewares
  app.use(compression());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Passport Middleware
  app.use(passport.initialize());
  passportAuth(passport);

  // Routes
  app.use("/api", routes);

  // Default Route
  app.get("/", (request, response) => {
    response.send("Hello Server From TwitVerse!!!😊😊😊😊");
  });

  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      status: 404,
      message: "URL doesn't exist",
    });
  });

  // Error Handling Middleware
  app.use(baseError);

  app.listen(serverConfig.PORT, async () => {
    console.log(`SERVER IS RUNNING ON PORT ${serverConfig.PORT}`);
  });
  await dbConnect();
};

serverStart();
