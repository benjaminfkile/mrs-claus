const express = require("express")
const crypto = require("crypto")
const fundStatusService = require("./fund-status-service");
const fundStatusRouter = express.Router()
const bcrypt = require('bcrypt');
const jsonParser = express.json()

fundStatusRouter
    .route("/get-fund-status")
    .get((req, res, next) => {
        const knexInstance = req.app.get("db")
        fundStatusService.getSponsors(knexInstance)
            .then(sponsors => {
                res.send(sponsors)
            })
            .catch(next)
    })

fundStatusRouter
    .route("/post-fund-status")
    .post(jsonParser, async (req, res, next) => {
        const knexInstance = req.app.get("db")
        let body = req.body
        let fundId
        let encriptedKey = "$2b$10$ziMtVZ4SB4a8/MdPnURxO.s/QxSN393Lexwl55cfOQ6vhuqFJbpBi"
        if (body.percent && body.pass) {
            bcrypt.compare(body.pass, encriptedKey, function (err, result) {
                if (result) {
                    if (!isNaN(body.percent)) {
                        let percent = parseInt(req.body.percent)
                        if (percent >= 0 && percent <= 100) {
                            fundId = crypto.randomBytes(16).toString('hex')
                            body.id = fundId
                            body.created = Date.now()
                            body.percent = percent
                            delete body.pass
                            try {
                                fundStatusService.postSponsor(knexInstance, body).then(() => {
                                    res.status(200).send({ message: "percent posted", value: body.percent })
                                }).catch(next)
                            } catch (err) {
                                res.status(400).send({ message: "failed to post data" })
                            }
                        } else {
                            res.status(400).send({ message: "range must be 0-100" })
                        }
                    } else {
                        res.status(400).send({ message: "please provide an integer" })
                    }
                } else {
                    res.status(403).send({ message: "invalid password" })
                }
            })
        } else {
            res.status(400).send({ message: "missing params" })
        }
    })

module.exports = fundStatusRouter