const swaggerUI = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

const specs = swaggerJsdoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "TodoApp",
      description: "API documentation for TodoApp",
      version: "1.0.0",
    },
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: "/api",
      },
    ],
  },
  apis: ["src/docs/*.yaml"],
})


module.exports = {
  swaggerUI,
  swaggerDocument: specs,
}



