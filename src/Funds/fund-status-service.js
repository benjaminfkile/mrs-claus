const service = {

    getSponsors(knex) {
        return knex
            .from("funds")
            .select("percent")
            .orderBy('created', 'desc')
            .first()
    },
    postSponsor(knex, data) {
        return knex
            .insert(data)
            .into("funds")
            .returning("*")
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = service