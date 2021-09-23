const express = require("express");
const router = express.Router();
const mailer = require("../Mailer/Mailer")
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
                // console.log("\n******************************\n" , charge , "\n******************************\n")
                mailer.sendMail(req.body.email, req.body.name, req.body.amount, charge.receipt_url )
                res.status(200).send({ message: charge })
            })
        } catch (err) {
            res.status(402).send({ message: "payment not accepted" })
        }
    })

module.exports = router