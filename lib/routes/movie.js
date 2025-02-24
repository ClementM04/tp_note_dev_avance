'use strict';

const Joi = require('joi')
const {Parser} = require("json2csv");
const {writeFileSync} = require("node:fs");
const {publishToQueue} = require("../messageBroker/messageBroker");

module.exports = [
    {
        method: 'post',
        path: '/movie',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().min(1).example('Inception').description('Title of the movie'),
                    description: Joi.string().required().min(3).example('A movie about dreams').description('Description of the movie'),
                    releaseDate: Joi.date().required().example('2010-07-16').description('Release date of the movie'),
                    director: Joi.string().required().min(3).example('Christopher Nolan').description('Director of the movie')
                })
            }
        }, handler: async (request, h) => {
            const { movieService, mailService, userService } = request.services();

            try {
                const users = await userService.findAll()
                console.log(users)
                users.map(user => {
                    mailService.sendMail(user.email, 'New movie added', `A new movie has been added to the database: ${request.payload.title}`)
                })
            } catch (err) {
                console.log(err)
            }

            return await movieService.create(request.payload);

        }
    },
    {
        method: 'delete',
        path: '/movie/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        }, handler: async (request, h) => {
            const { movieService, mailService, userService } = request.services();

            try {
                const users = await userService.findAll()

                const movie = await movieService.findMovieById(request.params.id)

                if (movie) {
                    users.map(user => {
                        mailService.sendMail(user.email, 'Movie deleted', `A movie as been removed fom our database: ${movie.title}`)
                    })
                }
            } catch (err) {
                console.log(err)
            }

            return await movieService.delete(request.params.id);

        }
    },
    {
        method: 'get',
        path: '/movie',
        options: {
            auth: false,
            tags: ['api']
        }, handler: async (request, h) => {
            const { movieService } = request.services();

            return await movieService.findAll();
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().min(3).example('Inception').description('Title of the movie'),
                    description: Joi.string().required().min(3).example('A movie about dreams and dicaprio').description('Description of the movie'),
                    releaseDate: Joi.date().required().example('2010-07-16').description('Release date of the movie'),
                    director: Joi.string().required().min(3).example('Christopher Nolan').description('Director of the movie')
                }),
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        }, handler: async (request, h) => {
            const { movieService, mailService } = request.services();

            try {
                const users = await movieService.getUserFavoriteByMovieId(request.params.id)

                const movie = await movieService.findMovieById(request.params.id)

                console.log(users)

                if (users) {
                    users.map(user => {
                        mailService.sendMail(user.email, 'Movie updated', `A movie as been update in our database: ${movie.title} is now ${request.payload.title}`)
                    })
                }

            } catch (err) {
                console.log(err)
            }

            return await movieService.update(request.params.id, request.payload);
        }
    },
    {
        method: 'GET',
        path: '/movie/export',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            description: 'Export CSV des films et envoi par mail'
        },
        handler: async (request, h) => {
            const { Movie } = request.server.models();
            const user = request.auth.credentials;

            try {
                const movies = await Movie.query().select();

                if (movies.length === 0) {
                    return 'Aucun film trouvé'
                }

                const fields = Object.keys(movies[0]);
                const json2csvParser = new Parser({ fields });
                const csvData = json2csvParser.parse(movies);

                const filePath = `./exports/movies_export_${Date.now()}.csv`;
                writeFileSync(filePath, csvData);

                await publishToQueue('movie_exports', {
                    filePath,
                    email: user.email
                });

                return 'Export en cours, vous recevrez un email.'
            } catch (error) {
                console.error(error);
                return 'Une erreur est survenue lors de l’export.'
            }
        }
    }

];
