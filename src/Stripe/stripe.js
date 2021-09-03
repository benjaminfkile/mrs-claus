const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const jsonParser = express.json()

router
    .route("/createCharge")
    .post(jsonParser, async (req, res) => {
        const { amount, cardId, oneTime, email } = req.body;
        if (oneTime) {
            const {
                cardNumber,
                cardExpMonth,
                cardExpYear,
                cardCVC,
                country,
                postalCode,
            } = req.body;

            if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
                return res.status(400).send({
                    Error: "Necessary Card Details are required for One Time Payment",
                });
            }
            try {
                const cardToken = await stripe.tokens.create({
                    card: {
                        number: cardNumber,
                        exp_month: cardExpMonth,
                        exp_year: cardExpYear,
                        cvc: cardCVC,
                        address_state: country,
                        address_zip: postalCode,
                    },
                });

                const charge = await stripe.charges.create({
                    amount: amount,
                    currency: "usd",
                    source: cardToken.id,
                    receipt_email: email,
                    description: `Stripe Charge Of Amount ${amount} for One Time Payment`,
                });

                if (charge.status === "succeeded") {
                    return res.status(200).send({ Success: charge });
                } else {
                    return res
                        .status(400)
                        .send({ Error: "Please try again later for One Time Payment" });
                }
            } catch (error) {
                return res.status(400).send({
                    Error: error.raw.message,
                });
            }
        } else {
            return res.status(400).send({
                Error: "Only One Time Payments Allowed",
            });
        }
    });

module.exports = router