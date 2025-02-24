# iut-project

# Présentation du projet 

Ce projet est une API de gestion de films avec des fonctionnalités de notifications par email, gestion des films favoris et export CSV via un message broker.

## Fonctionnalités

1. **Envoi de mails de bienvenue** : lorsqu'un utilisateur est créé, un mail de bienvenue est envoyé.

2. **Gestion des films** : les films contiennent des informations telles que le **titre**, la **description**, la **date de sortie** et le **réalisateur**. Seuls les **admins** peuvent créer, modifier et supprimer des films.

3. **Films favoris** : les utilisateurs peuvent ajouter ou supprimer des films de leurs favoris. Des messages d'erreur sont retournés si un film est déjà dans les favoris ou si on tente d'en supprimer un qui n'y est pas.

4. **Notifications** : lorsqu'un film est ajouté ou modifié, un mail est envoyé aux utilisateurs concernés (nouveau film ajouté ou film favori modifié).

5. **Export CSV** : les **admins** peuvent demander un export CSV de l'ensemble des films. Le fichier CSV est envoyé par mail via un **message broker**.


# Installation

## Prérequis
Pour ce projet il vous faut : 
- node.js (v 22)
- npm
- docker

## Les variables d'environnement

Toute les variables d'environnement présente dans le fichier `.env` sont à titre d'exemple, vous pouvez les modifier pour les adapter à votre configuration

MAIL_USER et MAIL_PASS sont les variables pour le mail du compte est le mail et le mot de passe du compte qui envoie les mails

DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE et DB_PORT sont les variables pour la connexion a la base de données

RABBITMQ_URL est la variable d'environnement pour la connexion à rabbitMQ, celle par défaut fonctionne si vous lancez le yaml que vous verrez juste après


## yaml pour rabbitMQ
Vous trouverez le fichier yaml dans le dossier `docker/docker-compose.yml`

Lancez la commande `docker-compose up` pour lancer le container rabbitMQ

Le mot de passe est `password` le nom d'utilisateur est `user`

Lancer `localhost:15672` pour accéder à l'interface de gestion de rabbitMQ

Lancer la fonction `node .\lib\consumer\emailConsumer.js` à la racine du projet afin de lancer le server rabbitMQ

## Les variables d'environnement

MAIL_USER et MAIL_PASS sont les variables pour le mail du compte est le mail et le mot de passe du compte qui envoie les mails

DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE et DB_PORT sont les variables pour la connexion a la base de données

RABBITMQ_URL est la variable d'environnement pour la connexion à rabbitMQ, celle par défaut fonctionne si vous lancez le yaml vu précédemment

## Lancement du projet

Pour lancer le projet, il faut lancer la commande `npm install` à la racine du projet pour installer les dépendances

Il faut ensuite lancer la commande `npx knex migrate:latest` pour lancer les migrations qui créeront les tables nécessaires au bon fonctionnement de la base de données

Enfin, lancer la commande `npm start` pour lancer le projet
