import { swaggerJsdoc, swaggerUi } from "../utils/imports.util.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Twitter Backend API",
      version: "1.0.0",
      description: "API documentation for Twitter Backend",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`, // Updated server URL and base path
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/route/*.js", "./src/controller/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
