'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('favorites', (table) => {

            table.increments('id').primary();
            table.integer('userId').unsigned().notNullable();
            table.integer('movieId').unsigned().notNullable();
            table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
            table.foreign('movieId').references('id').inTable('movie').onDelete('CASCADE');
            table.unique(['userId', 'movieId']);
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
    },

    async down(knex) {

        return knex.schema.dropTableIfExists('favorites');
    }
};
