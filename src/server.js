import {
  express,
  morgan,
  compression,
  helmet,
  cors,
  bodyParser,
} from "./utils/imports.util.js";
import { serverConfig, connection } from "./config/index.config.js";
import routes from "./routes/index.route.js";

const app = express();

const serverStart = async () => {
  // Middlewares
  app.use(morgan("dev"));
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Routes
  app.use("/api", routes);

  app.listen(serverConfig.PORT, async () => {
    console.log(`SERVER IS RUNNING ON PORT ${serverConfig.PORT}`);
  });
  await connection();
};

serverStart();

app.get("/", (request, response) => {
  response.send("Hello Server From TwitVerse!!!😊😊😊😊");
});
