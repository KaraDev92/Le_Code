"use strict"

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
//import * as echangeur  from './appliNode/mongoDB/mongoDBQueries.js;
import mongoose from "mongoose";
import { authRouter } from './appliNode/routes/authRoutes.js';
import { userRouter } from './appliNode/routes/userRoutes.js';

const uri = process.env.MONGODB_CONNECTION_STRING;

const app = express();

const port = process.env.PORT;

const corsOptions = {
    origin: "http://localhost:3030"
  };

app.use(cors(corsOptions));
app.use(bodyParser.json());
//app.use(express.static(process.cwd()+"/leFront/divineClub/dist")); 
//A compléter pour lancer Angular depuis Node ????

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// A compléter pour avoir tous les membres pour l'admin ?
// app.get('/users', (req, res) => {
// //     res.json(users);           
// });

//connection de mongoose à la BDD MongoDB
mongoose.connect(uri);
mongoose.connection.on("open", function() {
  console.log('Connection à MongoDB réussie');
});
mongoose.connection.on("error", function() {
  console.error('Connexion à MongoDB a rencontré une erreur :', error);
});
  
  // console.log("Connection à MongoDB en cours ...");

authRouter(app);
userRouter(app);
// app.get('/login', echangeur);

// app.post('/newuser', echangeur);

// app.put('/user', (req, res) => {
//     //const member = res.body.member;
//     // A compléter 
    
// });

// app.patch('/user', (req, res) => {
//     //const member = res.body.member;
//     // A compléter 
    
// });

// app.delete('/user', (req, res) => {
//     //const member = res.body.member;
//     // A compléter 
    
// });
  
app.get('/', (req,res) => {
    res.send('App Works !');
    //res.sendFile(process.cwd()+"/leFront/divineClub/index.html")  ???
});
  
app.listen(port, () => {
      console.log(`Serveur démarré sur le port : ${port}`);
});