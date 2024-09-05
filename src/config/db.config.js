import { mongoose } from "../utils/imports.util.js";
import { serverConfig } from "./serverConfig.js";

const readPreference = "secondary";
const writeConcern = { w: "majority", wtimeoutMS: 5000 };

export default async () => {
  try {
    const connectionOptions = {};
    let connectionUrl;

    if (serverConfig.DATABASE_URL_REPLICA) {
      // Connect to replica set
      connectionUrl = serverConfig.DATABASE_URL_REPLICA;
      connectionOptions.readPreference = readPreference;
      connectionOptions.w = writeConcern.w;
      connectionOptions.wtimeoutMS = writeConcern.wtimeoutMS;
    } else {
      // Connect to single database
      connectionUrl = serverConfig.DATABASE_URL;
    }

    await mongoose.connect(connectionUrl, connectionOptions);

    if (serverConfig.DATABASE_URL_REPLICA) {
      console.log("Connected to MongoDB replica set");
      console.log(
        `Read operations will be directed to ${readPreference} nodes`
      );
      console.log(
        `Write operations will use write concern: ${JSON.stringify(
          writeConcern
        )}`
      );
    } else {
      console.log("Connected to MongoDB single instance");
    }

    console.log(
      "CONNECTED TO DATABASE:",
      connectionUrl.split("/").pop().split("?")[0]
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};
