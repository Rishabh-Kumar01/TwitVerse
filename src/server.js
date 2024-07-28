const {
  express,
  morgan,
  compression,
  helmet,
  cors,
} = require("./utils/imports.util");
const { serverConfig, connection } = require("./config/index.config");

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

module.exports = app;
