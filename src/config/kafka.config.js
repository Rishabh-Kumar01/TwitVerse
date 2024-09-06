import { serverConfig } from "./serverConfig.js";
import { ServiceError } from "../error/custom.error.js";
import { responseCodes, kafkaImport } from "../utils/imports.util.js";

const { StatusCodes } = responseCodes;
const { Kafka, logLevel } = kafkaImport;

const kafka = new Kafka({
  clientId: "twitverse",
  brokers: [serverConfig.KAFKA_BROKER],
  logLevel: logLevel.DEBUG,
});

const producer = kafka.producer();
const admin = kafka.admin();

export const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka producer connected");
  } catch (error) {
    console.error("Failed to connect Kafka producer:", error);
    throw new ServiceError(
      "Kafka Connection Failed",
      "Failed to connect to Kafka broker",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const sendOtpRequest = async (topic, data) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    });
    console.log("OTP request sent to Kafka");
  } catch (error) {
    console.error("Failed to send OTP request to Kafka:", error);
    throw new ServiceError(
      "OTP Request Failed",
      "Failed to send OTP request",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const createTopic = async (
  topic,
  numPartitions = 1,
  replicationFactor = 1
) => {
  try {
    console.log("Connecting admin for creating topic...");
    await admin.connect();
    console.log("Admin Connection Success for creating topic");

    console.log("Creating topic: ", topic);
    await admin.createTopics({
      topics: [
        {
          topic,
          numPartitions,
          replicationFactor,
        },
      ],
    });
    console.log(`Topic '${topic}' created successfully`);
  } catch (error) {
    console.error(`Failed to create topic '${topic}':`, error);
    throw new ServiceError(
      "Topic Creation Failed",
      `Failed to create Kafka topic '${topic}'`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    console.log("Disconnecting admin connection after creating topic...");
    await admin.disconnect();
  }
};

export const listTopics = async () => {
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    console.log("Kafka topics:", topics);
    return topics;
  } catch (error) {
    console.error("Failed to list Kafka topics:", error);
    throw new ServiceError(
      "Topic Listing Failed",
      "Failed to list Kafka topics",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    await admin.disconnect();
  }
};

export const deleteTopics = async (topics) => {
  try {
    await admin.connect();
    await admin.deleteTopics({
      topics,
    });
    console.log(`Topics ${topics.join(", ")} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete topics ${topics.join(", ")}:`, error);
    throw new ServiceError(
      "Topic Deletion Failed",
      `Failed to delete Kafka topics ${topics.join(", ")}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    await admin.disconnect();
  }
};

export const getTopicMetadata = async (topics) => {
  try {
    await admin.connect();
    const metadata = await admin.fetchTopicMetadata({
      topics,
    });
    console.log("Topic metadata:", metadata);
    return metadata;
  } catch (error) {
    console.error("Failed to fetch topic metadata:", error);
    throw new ServiceError(
      "Metadata Fetch Failed",
      "Failed to fetch Kafka topic metadata",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    await admin.disconnect();
  }
};
