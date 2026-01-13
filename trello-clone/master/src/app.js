const dotenv = require("dotenv")
dotenv.config()

const { swaggerUI, swaggerDocument } = require("./docs")

const express = require("express")
const routes = require("./routes")
const app = express()
const bodyParser = require("body-parser")
const { createDatabaseConnection } = require("./config/database")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use("/api", routes)

app.use((err, req, res, next) => {
  res.status(500).send(err)
})

app.listen(process.env.PORT, () => {
  console.log("Server is up on port", process.env.PORT)
})

createDatabaseConnection().then(() => {
  console.log("Connected to database")
}).catch(console.error)

module.exports = { app }
