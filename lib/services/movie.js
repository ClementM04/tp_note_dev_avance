'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class MovieService extends Service {

    create(movie){

        const { Movie } = this.server.models();

        return Movie.query().insertAndFetch(movie);
    }

    findAll(){

        const { Movie } = this.server.models();

        return Movie.query();
    }

    delete(id){

        const { Movie } = this.server.models();

        return Movie.query().deleteById(id);
    }

    update(id, movie){

        const { Movie } = this.server.models();

        return Movie.query().findById(id).patch(movie);
    }

    findMovieById(id){
        const { Movie } = this.server.models();
        return Movie.query().findById(id);
    }


    async getUserFavoriteByMovieId(movieId) {
        const { User } = this.server.models();

        try {
            const users = await User.query()
                .join('favorites', 'user.id', 'favorites.userId')
                .where('favorites.movieId', movieId)
                .select('user.*');

            return users;
        } catch (error) {
            console.error('Error fetching users by favorite movie:', error);
            throw new Error('Database error while fetching users.');
        }
    }


}
