//routes pour vérifier l'authentification des utilisateurs

import { verifySignUp } from "../middlewares/verifySignUp.js";
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
  
    //pour les nouveaux membres
    app.post(
        "/newuser", passerParLa,
        verifySignUp,
        signup
    );

    //pour se loguer
    app.post("/login", signin);

    //pour récupérer les données de son profil
    app.get("/user", verifyToken, dataForProfile);

    //pour poster un nouveau post
    app.put("/userpost", verifyToken, newPost);

    //pour chercher un membre
    app.post("/searchmember", passerParLa, verifyToken, searchForAMember);
};
