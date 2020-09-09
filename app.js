const express = require('express');
const app = express();
// const db = pgp("postgres://username:")
// const pg = require('pg');
// const connectionString = "pg://postgres@localhost:5432/people";
// const client = new pg.Client(connectionString);
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:stpzga8n@localhost:5433/');


class Movies extends Model { }
Movies.init({
    Film: {
        type: DataTypes.STRING,
    },
    Genre: {
        type: DataTypes.STRING,
    },
    'Lead Studio': {
        type: DataTypes.STRING,
    },
    Year: {
        type: DataTypes.INTEGER,
    }


},
    {
        sequelize, modelName: 'movies', freezeTableName: true, createdAt: false, updatedAt: false
    });
Movies.removeAttribute('id');


app.get('/', async (req, res) => {

    await sequelize.sync();
    const film = await Movies.findAll();
    console.log(film);
    res.json(film);

});

app.get('/people', (req, res) => {
    res.json([{
        prenom: "Mehdi",
        nom: "Moidonc"
    },
    {
        prenom: "Nicolas",
        nom: "Masticot"
    }])
});

app.listen(3000, () => {
    console.log("Serveur démarré (http://localhost:3000/) !");
});