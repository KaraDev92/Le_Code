//routes pour vérifier l'authentification des utilisateurs

import { verifySignUp, verifyEmail, verifyPseudo } from "../middlewares/verifySignUp.js";
import { signup, signin } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authJwt.js";
import { dataForProfile, newPost, searchForAMember } from "../mongoDB/DBQueries.js";



export const authRouter = (app) => {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, Content-Type, Accept"
      );
      next();
    });

    //pour le débogage
    const passerParLa = function(req,res,next) {
      console.log('la requête est passée par là : headers', req.headers, ' body : ', req.body);
      next();
    }
    //pour le validateur d'email
    app.get("/checkemail/:id", verifyEmail);

    //pour le validateur de pseudo
    app.get("/checkpseudo/:id", verifyPseudo);

    //pour les nouveaux membres
    app.post("/newuser", verifySignUp, signup);

    //pour se loguer
    app.post("/login", signin);

    //pour récupérer les données de son profil
    app.get("/user", verifyToken, dataForProfile);

    //pour poster un nouveau post
    app.put("/userpost", verifyToken, newPost);

    //pour chercher un membre
    app.post("/searchmember", passerParLa, verifyToken, searchForAMember);
};
