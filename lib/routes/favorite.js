'use strict';

const Joi = require('joi')

module.exports = [
    {
        method: 'POST',
        path: '/movie/like/{movieId}',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    movieId: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {
            const user = request.auth.credentials;
            const { favoriteService } = request.services();
            const { movieId } = request.params;

            return favoriteService.addMovieTolike(user.id, movieId);

        }
    },
    {
        method: 'DELETE',
        path: '/movie/unlike/{movieId}',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    movieId: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {
            const user = request.auth.credentials;
            const { favoriteService } = request.services();
            const { movieId } = request.params;

            return favoriteService.unlikeMovie(user.id, movieId);

        }
    },
    {
        method: 'GET',
        path: '/movie/favorites',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const user = request.auth.credentials;
            const { favoriteService } = request.services();

            console.log(user)

            return favoriteService.getLikedMovies(user.id);
        }
    }
]
