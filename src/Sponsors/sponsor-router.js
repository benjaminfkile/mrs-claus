const express = require("express")
const crypto = require("crypto")
const sponsorService = require("./sponsor-service");
const sponsorRouter = express.Router()
const jsonParser = express.json()

sponsorRouter
    .route("/get-sponsors")
    .get((req, res, next) => {
        const knexInstance = req.app.get("db")
        sponsorService.getSponsors(knexInstance)
            .then(sponsors => {
                res.send(sponsors)
            })
            .catch(next)
    })

sponsorRouter
    .route("/get-sponsor-data")
    .get((req, res, next) => {
        const knexInstance = req.app.get("db")
        sponsorService.getSponsorData(knexInstance)
            .then(sponsors => {
                res.send(sponsors)
            }).catch(next)
    })

sponsorRouter
    .route("/post-sponsor")
    .post(jsonParser, async (req, res, next) => {
        const knexInstance = req.app.get("db")
        let body = req.body
        let sponsorId
        if (body.name && body.contact_person && body.email && body.phone && body.amount_donated) {
            sponsorId = crypto.randomBytes(16).toString('hex')
            body.sponsor_id = sponsorId
            body.created_date = Date.now()
            try {
                sponsorService.postSponsor(knexInstance, body).then(() => {
                    res.status(200).send({ message: "sponsor posted", id: sponsorId })
                }).catch(next)
            } catch (err) {
                res.status(400).send({ message: "failed to post data" })
            }
        } else {
            res.status(400).send({ message: "missing params" })
        }
    })

module.exports = sponsorRouter