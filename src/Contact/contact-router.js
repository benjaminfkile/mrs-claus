const express = require("express");
const contactrouter = express.Router();
const contactService = require("./contact-service")
const mailer = require("../Mailer/Mailer");
const { v4: uuidv4 } = require('uuid');
const jsonParser = express.json()


contactrouter
    .route("/")
    .post(jsonParser, async (req, res, next) => {
        const knexInstance = req.app.get("db")

        // mailer.sendMail("benjaminfkile@gmail.com", req.body.email, "New Message from Contact form", req.body.message, ["${amount}", "${receiptUrl}"], [`${req.body.amount}`, `${newCharge.receipt_url}`])
        // .then(data =>{
        //     console.log(data)
        // })

        try {
            let rb = req.body
            rb.created = Date.now()
            rb.id = uuidv4()
            if (rb.name && rb.email && rb.message && rb.created && rb.id && Object.keys(rb).length === 5) {
                contactService.postContactMessage(knexInstance, rb).then(() => {
                }).then(() => {
                    mailer.sendContactMail(rb.name, rb.email, rb.message)
                }).then(() => {
                    res.status(200).send({ message: "mail sent" })
                }).catch(next)
            } else {
                res.status(400).send({ message: "bad request" })
            }
        } catch {
            res.status(400).send({ message: "unknow error" })
        }
    })

module.exports = contactrouter