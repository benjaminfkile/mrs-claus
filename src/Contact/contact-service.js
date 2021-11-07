const service = {
    postContactMessage(knex, data) {
        return knex
            .insert(data)
            .into("messages")
            .returning("*")
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = service