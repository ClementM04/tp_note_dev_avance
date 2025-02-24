'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class FavoriteService extends Service {

    static get name() {
        return 'favoriteService';  // Nom obligatoire du service
    }

    async addMovieTolike(userId, movieId){

        const { Favorite } = this.server.models();

        const movie = await Favorite.query().findOne({userId, movieId});

        if (movie) {
            throw Boom.badRequest('Movie already liked');
        } else {
            return Favorite.query().insert({userId, movieId});
        }
    }

    getLikedMovies(userId){

        const { Favorite } = this.server.models();

        return Favorite.query()
            .join('movie', 'favorites.movieId', 'movie.id')
            .where('userId', userId)
            .select('movie.title', 'movie.releaseDate', 'movie.director', 'movie.description');
    }

    async unlikeMovie(userId, movieId){

        const { Favorite } = this.server.models();

        const movie = await Favorite.query().findOne({userId, movieId});

        if (!movie) {
            throw Boom.notFound('Movie not found in your favorites');
        } else {
            return Favorite.query()
                .delete()
                .where('userId', userId)
                .andWhere('movieId', movieId);
        }

    }

}
