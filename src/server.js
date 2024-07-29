import {
  express,
  morgan,
  compression,
  helmet,
  cors,
} from "./utils/imports.util.js";
import { serverConfig, connection } from "./config/index.config.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const serverStart = async () => {
  console.log(`SERVER IS RUNNING ON PORT ${serverConfig.PORT}`);
  await connection();
};

serverStart();

app.get("/", (request, response) => {
  response.send("Hello Server!!!😊😊😊😊");
});
