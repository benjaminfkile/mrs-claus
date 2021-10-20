const express = require("express");
const donaterouter = express.Router();
const donateService = require("./donate-service")
const mailer = require("../Mailer/Mailer")
const jsonParser = express.json()
let stripe
if (process.env.TEST === "true") {
    stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
} else {
    stripe = require("stripe")(process.env.STRIPE_KEY);
}

donaterouter
    .route("/createCharge")
    .post(jsonParser, async (req, res, next) => {
        try {
            await stripe.charges.create({
                amount: parseInt(req.body.amount) * 100,
                currency: "usd",
                source: req.body.token.id,
                receipt_email: "benjaminfkile@gmail.com",
                description: `Stripe Charge Of Amount ${parseInt(req.body.amount) * 100} for One Time Payment`,
            }).then(charge => {
                // console.log("\n******************************\n" , charge , "\n******************************\n")
                const knexInstance = req.app.get("db")
                let postbody = { name: req.body.name, email: req.body.email, amount: req.body.amount, created_date: Date.now(), stripe_id: charge.id }
                donateService.postDonation(knexInstance, postbody).then(() => {
                    res.status(200).send({ id: charge.id, status: charge.status })
                }).then(() => {
                    mailer.sendMail(req.body.email, req.body.name, req.body.amount, charge.receipt_url)
                })
            })
        } catch (err) {
            console.log(err)
            res.status(402).send({ message: "payment not accepted" })
        }
    })

module.exports = donaterouter