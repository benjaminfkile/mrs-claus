const service = {

    getSponsorData(knex) {
        return knex.from("sponsors").select("*")
    },
    getSponsors(knex) {
        return knex.from("sponsors").select("name", "website_url", "fb_url", "logo")
    },
    getSponsor(knex, id) {
        return knex.from("sponsors")
            .where({ id: id })
            .then(rows => {
                return rows[0]
            })
    },
    postSponsor(knex, data) {
        return knex
            .insert(data)
            .into("sponsors")
            .returning("*")
            .then(rows => {
                return rows[0]
            })
    },
    deleteSponsor(knex, id) {
        return knex.select(id).from('sponsors')
            .where({ id })
            .delete()
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = service