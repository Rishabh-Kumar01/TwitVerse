import { createTopic, listTopics } from "./kafka.config.js";
import { ServiceError } from "../error/custom.error.js";
import { responseCodes } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;

const requiredTopics = [
  { name: "otp-requests", partitions: 3, replicationFactor: 1 },
];

const initializeKafkaTopics = async () => {
  try {
    const existingTopics = await listTopics();

    for (const topic of requiredTopics) {
      if (!existingTopics.includes(topic.name)) {
        await createTopic(
          topic.name,
          topic.partitions,
          topic.replicationFactor
        );
        console.log(`Created topic: ${topic.name}`);
      } else {
        console.log(`Topic ${topic.name} already exists`);
      }
    }

    console.log("Kafka topics initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Kafka topics:", error);
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError(
      "Kafka Initialization Failed",
      "An error occurred while initializing Kafka topics",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export default initializeKafkaTopics;
