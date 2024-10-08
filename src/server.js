import {
  express,
  morgan,
  compression,
  helmet,
  cors,
  passport,
} from "./utils/imports.util.js";
import baseError from "../src/error/base.error.js";
import {
  serverConfig,
  dbConnect,
  passportAuth,
  swaggerConfig,
  redisClient,
  kafkaConfig,
  initializeKafkaTopics,
} from "./config/index.config.js";
import routes from "./route/index.route.js";
import { customMorgan } from "./middleware/index.middleware.js";

const { swaggerUi, specs } = swaggerConfig;

const app = express();

const serverStart = async () => {
  // Database Connection
  await dbConnect();

  // Redis Connection
  await redisClient.connect();

  // Kafka Initialization
  await kafkaConfig.connectProducer();
  // await initializeKafkaTopics();

  // Middlewares
  try {
    app.use(express.static("public"));
    app.use(compression());
    app.use(cors());
    app.use(helmet());
    app.use(customMorgan);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Passport Middleware
    app.use(passport.initialize());
    passportAuth(passport);

    // Routes
    app.use("/api", routes);

    // Default Route
    app.get("/", (request, response) => {
      response.send("Hello Server From TwitVerse!!!😊😊😊😊");
    });

    // Swagger Docs
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

serverStart();
