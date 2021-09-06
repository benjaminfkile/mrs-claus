const express = require("express");
const router = express.Router();
const jsonParser = express.json()
let stripe
if (process.env.TEST === "true") {
    stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
} else {
    stripe = require("stripe")(process.env.STRIPE_KEY);
}

router
    .route("/createCharge")
    .post(jsonParser, async (req, res) => {
        try {
            await stripe.charges.create({
                amount: parseInt(req.body.amount) * 100,
                currency: "usd",
                source: req.body.token.id,
                receipt_email: "benjaminfkile@gmail.com",
                description: `Stripe Charge Of Amount ${parseInt(req.body.amount) * 100} for One Time Payment`,
            }).then(charge => {
                res.status(200).send({ message: charge })
            })
        } catch (err) {
            res.status(400).send({ message: "bad request" })
            console.log(err)
        }
    })

module.exports = router