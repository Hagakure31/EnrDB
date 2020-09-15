const express = require("express");
const bodyParser = require("body-parser")
const app = express();
// const cors = require('cors');
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000

// app.use(cors());
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    try {
        if(req.url == '/inscription' || req.url == '/login'){
            next();
            return;
        }
    const currentToken = req.cookies['access_token'];
    const payload = jwt.verify(currentToken, "un secret");
    req.auth = payload;
    next();
    }catch(error){
        res.status(401).send("unauthorized");

    }
});

app.set('view engine', 'ejs');

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:stpzga8n@localhost:5433/');

// const User = sequelize.import(__dirname+ "/models/user.js");


// class Movies extends Model { }
// Movies.init({
//     Film: {
//         type: DataTypes.STRING,
//     },
//     Genre: {
//         type: DataTypes.STRING,
//     },
//     'Lead Studio': {
//         type: DataTypes.STRING,
//     },
//     Year: {
//         type: DataTypes.INTEGER,
//     }


// },
//     {
//         sequelize, modelName: 'movies', freezeTableName: true, createdAt: false, updatedAt: false
//     });
// Movies.removeAttribute('id');

class User extends Model { }
User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,

    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,

    }


},
    {
        sequelize, modelName: 'users', freezeTableName: false, createdAt: false, updatedAt: false
    });
User.removeAttribute('id');


app.get('/movies', async (req, res) => {

    await sequelize.sync();
    const film = await Movies.findAll();
    console.log(film);
    res.json(film);

});

app.get('/users', async (req, res) => {
    await sequelize.sync();
    const users = await User.findAll();
    console.log(users);
    res.json(users);
});

app.get('/inscription', (req, res) => {
    res.render('inscription', { errors: [] }
    );
});

app.post('/inscription', async (req, res) => {

    try {
        let postedUser = {};
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        postedUser = {
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword
        }
        User.create(postedUser);
        res.redirect('/login');
        res.status(200);
    } catch {
        res.redirect('/inscription');
    }

    console.log(postedUser);
});

app.get('/login', (req, res) => {
    res.render('login', { errors: [] }
    );
});

app.post('/login', async (req, res) => {
try {
    

    const userToCheck = await User.findOne({
        where: {
            email: req.body.email
        }
    });
        if(!!userToCheck && bcrypt.compareSync(req.body.password, userToCheck.password)){
            const PayloadJwt = {
                email: userToCheck.email,
                username: userToCheck.username
            }
            const token = jwt.sign(PayloadJwt, "un secret", {
                expiresIn: '2 days'
            });

            new Cookies(req, res).set('access_token', token, {
                httpOnly: true,
                secure: false
            });

            res.status(200).redirect('/profile');
            } else {
                res.status(403).send('Wrong credentials');
            }
        } catch (err){ 
       
            console.log('error: ' + err)
        
    }
    
});
    

app.get('/profile', (req, res) => {
    
    res.status(200).json({username: req.auth.username, email: req.auth.email});
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});



// User.create({
//     email: req.body.email,
//     username: req.body.username,
//     password: req.body.password
// })
//     // .then(data => {
//     //     res.send(data);
//     //     console.log(postedUser);
//     // })
//     .catch(err => {
//         res.status(500).send({
//             message:
//                 err.message || "An error has occured"
//         })
//     })
// })
