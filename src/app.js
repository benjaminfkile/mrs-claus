require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("helmet")
const { NODE_ENV } = require("./config")
const stripeRouter = require("./Stripe/stripe")
const sponsorRouter = require("./Sponsors/sponsor-router")
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

app.use("/api/donate", stripeRouter)
app.use("/api/sponsors", sponsorRouter)

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