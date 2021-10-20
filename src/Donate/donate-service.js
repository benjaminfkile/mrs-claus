const service = {
    postDonation(knex, data) {
        return knex
            .insert(data)
            .into("donators")
            .returning("*")
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = service