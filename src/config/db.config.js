import { mongoose } from "../utils/imports.util.js";
import { serverConfig } from "./serverConfig.js";

// export default () =>
//   mongoose
//     .connect(serverConfig.DATABASE_URL)
//     .then(() =>
//       console.log(
//         "CONNECTED TO DATABASE:",
//         serverConfig.DATABASE_URL.split("/").pop()
//       )
//     )
//     .catch((error) => console.log("DATABASE CONNECTION ERROR", error));

const readPreference = "secondary";
const writeConcern = { w: "majority", wtimeout: 5000 };

export default async () => {
  try {
    await mongoose.connect(serverConfig.DATABASE_URL, {
      readPreference: readPreference,
      w: writeConcern.w,
      wtimeoutMS: writeConcern.wtimeout,
    });
    console.log("Connected to MongoDB replica set");

    console.log(`Read operations will be directed to ${readPreference} nodes`);
    console.log(
      `Write operations will use write concern: ${JSON.stringify(writeConcern)}`
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};
