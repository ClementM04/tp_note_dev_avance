'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

    static get tableName() {

        return 'movie';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(3).example('Jurassic park').description('title of the movie'),
            description: Joi.string().min(10).example('Ne pas réveiller le chat qui dort... C\'est ce que le milliardaire John Hammond aurait dû se rappeler avant de se lancer dans le "clonage" de dinosaures. C\'est à partir d\'une goutte de sang absorbée par un moustique fossilisé que John Hammond et son équipe ont réussi à faire renaître une dizaine d\'espèces de dinosaures. Il s\'apprête maintenant avec la complicité du docteur Alan Grant, paléontologue de renom, et de son amie Ellie, à ouvrir le plus grand parc à thème du monde. Mais c\'était sans compter la cupidité et la malveillance de l\'informaticien Dennis Nedry, et éventuellement des dinosaures, seuls maîtres sur l\'île...').description('description of the movie'),
            releaseDate: Joi.date(),
            director: Joi.string().example('Spielberg').description('director of the movie'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

    static get jsonAttributes(){

        return ['roles']
    }

    static get relationMappings() {
        const User = require('./user');
        const Favorite = require('./Favorite');

        return {
            favoritedBy: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'movie.id',
                    through: {
                        from: 'favorites.filmId',
                        to: 'favorites.userId'
                    },
                    to: 'user.id'
                }
            }
        };
    }


};
