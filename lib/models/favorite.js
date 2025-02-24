// models/Favorite.js
const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Favorite extends Model {
    static get tableName() {
        return 'favorites';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer(),
            userId: Joi.number().integer().required(),
            movieId: Joi.number().integer().required()
        });
    }

    static get relationMappings() {
        const User = require('./user');
        const Movie = require('./movie');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: { from: 'favorites.userId', to: 'user.id' }
            },
            movie: {
                relation: Model.BelongsToOneRelation,
                modelClass: Movie,
                join: { from: 'favorites.movieId', to: 'movie.id' }
            }
        };
    }


};
