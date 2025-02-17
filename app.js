

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import mongoose from "mongoose";
import { authRouter } from './appliNode/routes/authRoutes.js';
import { userRouter } from './appliNode/routes/userRoutes.js';

const uri = process.env.MONGODB_CONNECTION_STRING;

const app = express();

const port = process.env.PORT;

const corsOptions = {
    origin: "https://karadev--divine-club--m6tyjvjtlvvw.code.run/"
};

  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/appliNode/leFront/divineClub/dist/divine-club/browser")); 
//A compléter pour lancer Angular depuis Node 

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


//connection de mongoose à la BDD MongoDB
mongoose.connect(uri);
mongoose.connection.on("open", function() {
  console.log('Connection à MongoDB réussie');
});
mongoose.connection.on("error", function() {
  console.error('Connexion à MongoDB a rencontré une erreur :', error);
});
  
console.log("Connection à MongoDB en cours ...");

//dispatch des divers requêtes
authRouter(app);
userRouter(app);


//page d'accueil  
app.get('/', (req,res) => {
    //res.send('App Works !');
    res.sendFile(process.cwd()+"/appliNode/leFront/divineClub/dist/divine-club/browser/index.html");
    
});
  
app.listen(port, () => {
      console.log(`Serveur démarré sur le port : ${port}`);
});