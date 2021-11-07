require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("helmet")
const { NODE_ENV } = require("./config")
const donateRouter = require("./Donate/donate-router")
const sponsorRouter = require("./Sponsors/sponsor-router")
const contactRouter = require("./Contact/contact-router")
const app = express()

const morganOption = (NODE_ENV === "production")
  ? "tiny"
  : "common";

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.get("/", (req, res) => {
  res.send("Mrs Claus")
})

app.use("/api/donate", donateRouter)
app.use("/api/sponsors", sponsorRouter)
app.use("/api/contact", contactRouter)

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app