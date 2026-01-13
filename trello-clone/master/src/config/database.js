const mongoose = require("mongoose")
const { MONGO_DB_CONNECTION_STRING, MONGO_DB_NAME } = process.env
const { MongoMemoryServer } = require("mongodb-memory-server")
let mongoServer

const createDatabaseConnection = async () => {
  try {
    await mongoose.connect(`${MONGO_DB_CONNECTION_STRING}/${MONGO_DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw error
  }
}

const createDatabaseConnectionTest = async () => {
  try {
    let mongoUri = ""
    if (process.env.NODE_ENV === "test") {
      mongoServer = await MongoMemoryServer.create()
      mongoUri = mongoServer.getUri() + "test"
      await mongoose.disconnect()
    } else {
      mongoUri = `${MONGO_DB_CONNECTION_STRING}/${MONGO_DB_NAME}`
    }
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw error
  }
}


module.exports = { createDatabaseConnection, createDatabaseConnectionTest }
